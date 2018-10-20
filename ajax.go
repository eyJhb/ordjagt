package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	valid "github.com/asaskevich/govalidator"
	"github.com/rs/zerolog/log"
)

type ReqDefault struct {
	Mobile string `schema:"mobile,required"`
	Nocahe string `schema:"_,required",valid:"email"`
}

type Word struct {
	Word  string `json:"w" valid:"required,length(3|12)"`
	Score int    `json:"s" valid:"required,int"`
	Hash  string `json:"sh" valid:"required,length(40|40)"`
}

type GameOver struct {
	Userid   string `json:"mobile" valid:"required,numeric,length(8|8)"`
	Score    int    `json:"score" valid:"int"`
	GameSeed string `json:"sd" valid:"required,length(51|51)"`
	Hash     string `json:"sh" valid:"required,length(40|40)"`
	Words    []Word `json:"w"`
}

type Signup struct {
	Mobile    string `json:"mobile" valid:"required,numeric,length(8|8)"`
	Firstname string `json:"firstname" valid:"required,length(2|10)"`
	Surname   string `json:"surname" valid:"required,length(2|15)"`
	Email     string `json:"email" valid:"required,email"`
}

type AjaxReponse struct {
	Success bool     `json:"success"`
	Page    string   `json:"page"`
	Errors  []string `json:"errors"`
}

func (o *ordjagt) ajaxGameOver(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("ajax.GameOver")
	w.Header().Set("Content-Type", "application/json")

	var req GameOver
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().
			Err(err).
			Msg("ajax.GameOver: could not decode received json")
		res := AjaxReponse{
			Success: false,
			Page:    "try_again",
			Errors:  []string{"Could not decode received json"},
		}
		resJson, _ := json.Marshal(res)
		fmt.Fprintf(w, string(resJson))
		return
	}

	result, err := valid.ValidateStruct(req)
	if err != nil {
		log.Error().
			Err(err).
			Msg("ajax.GameOver: invalid json")
		res := AjaxReponse{
			Success: false,
			Page:    "try_again",
			Errors:  []string{"Invalid json structure"},
		}
		resJson, _ := json.Marshal(res)
		fmt.Fprintf(w, string(resJson))
		return
	}

	if result == false {
		log.Error().
			Msg("ajax.GameOver: Failed validation")
		res := AjaxReponse{
			Success: false,
			Page:    "try_again",
			Errors:  []string{"Failed validation"},
		}
		resJson, _ := json.Marshal(res)
		fmt.Fprintf(w, string(resJson))
		return
	}

	// validate our main security-hash
	sh := req.Userid + strconv.Itoa(req.Score) + strconv.Itoa(len(req.Words)) + req.GameSeed + o.EncryptionKey
	shSha1 := calcsha1(sh)

	if shSha1 != req.Hash {
		log.Error().
			Str("sh", req.Hash).
			Str("calc-sh", shSha1).
			Msg("ajax.GameOver: Hashes did not match")
		res := AjaxReponse{
			Success: false,
			Page:    "try_again",
			Errors:  []string{"Failed security-hash validation"},
		}
		resJson, _ := json.Marshal(res)
		fmt.Fprintf(w, string(resJson))
		return
	}

	// validate each word hash
	for _, word := range req.Words {
		wordSh := word.Word + strconv.Itoa(word.Score) + req.GameSeed + o.EncryptionKey
		wordShHash := calcsha1(wordSh)

		if wordShHash != word.Hash {
			log.Error().
				Str("sh", req.Hash).
				Str("calc-sh", shSha1).
				Msg("ajax.GameOver: Word Hashes did not match")
			res := AjaxReponse{
				Success: false,
				Errors:  []string{"Failed word security-hash validation"},
			}
			resJson, _ := json.Marshal(res)
			fmt.Fprintf(w, string(resJson))
			return
		}

	}

	o.UserAddScore(req.Userid, req.Score)

	fmt.Fprintf(w, `{"page": "try_again"}`)
}

func (o *ordjagt) ajaxSignup(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("ajax.Signup")

	w.Header().Set("Content-Type", "application/json")

	var req Signup
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().
			Err(err).
			Msg("ajax.Signup: could not decode received json")
		res := AjaxReponse{
			Success: false,
			Errors:  []string{"Forkert json data sendt"},
		}
		resJson, _ := json.Marshal(res)
		fmt.Fprintf(w, string(resJson))
		return
	}

	result, err := valid.ValidateStruct(req)
	if err != nil {
		log.Error().
			Err(err).
			Msg("ajax.Signup: Failed validation")
		res := AjaxReponse{
			Success: false,
			Errors:  strings.Split(err.Error(), ";"),
		}
		resJson, _ := json.Marshal(res)
		fmt.Fprintf(w, string(resJson))
		return
	}

	if result == false {
		log.Error().
			Msg("ajax.Signup: Failed validation")
		res := AjaxReponse{
			Success: false,
			Errors:  []string{"Kunne ikke validerer dataen"},
		}
		resJson, _ := json.Marshal(res)
		fmt.Fprintf(w, string(resJson))
		return
	}

	details := UserDetails{
		Firstname: req.Firstname,
		Surname:   req.Surname,
		Email:     req.Email,
	}

	o.UserSignup(req.Mobile, details)

	res := AjaxReponse{
		Success: true,
		Errors:  []string{},
	}
	resJson, _ := json.Marshal(res)
	fmt.Fprintf(w, string(resJson))
	return
}

func (o *ordjagt) ajaxRedirectTo(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, `{"tries_left": 3}`)
}

func (o *ordjagt) ajaxSaveMobile(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("ajax.saveMobile")

	fmt.Fprintf(w, "true")
}
