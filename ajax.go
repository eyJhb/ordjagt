package main

import (
	"encoding/json"
	"fmt"
	"net/http"

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

func (o *ordjagt) ajaxGameOver(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("ajax.GameOver")

	var req GameOver
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().
			Err(err).
			Msg("ajax.GameOver: could not decode received json")
		return
	}

	fmt.Println("-----WORDS-----")
	for _, word := range req.Words {
		fmt.Println(word)
	}
	fmt.Println("!!!!!WORDS!!!!!")

	result, err := valid.ValidateStruct(req)
	if err != nil {
		log.Error().
			Err(err).
			Msg("ajax.GameOver: invalid json")
		return
	}

	if result == false {
		log.Error().
			Msg("ajax.GameOver: Failed validation")
		return
	}

	o.AddScore(req.Userid, req.Score)

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"page": "try_again"}`)
}

func (o *ordjagt) ajaxRedirectTo(w http.ResponseWriter, r *http.Request) {
	// fmt.Fprintf(w, `{"error": false, "tries_left": 1}`)
	fmt.Fprintf(w, `{"tries_left": 3}`)
}

func (o *ordjagt) ajaxSaveMobile(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("ajax.saveMobile")

	// r.ParseForm()
	// mobile := r.Form["mobile"][0]
	// o.Users[mobile] = user{Name: mobile, Scores: []int{}}

	fmt.Fprintf(w, "true")
}
