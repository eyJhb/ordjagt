package main

import (
	"net/http"

	"github.com/rs/zerolog/log"
)

type viewsTryAgain struct {
	Score          int
	PersonalRecord int
	TriesLeft      int
	ShowSignup     bool
}

type viewsSignup struct {
	Mobile string
}

type viewsHighscore struct {
	Highscores map[int]*Score
}

type viewsGame struct {
	Seed string
}

func (o *ordjagt) viewsIndex(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("view.index")
	o.viewsIndexTmpl.Execute(w, "")
}

type DefaultGet struct {
	Mobile string `schema:"mobile,required"`
	Nocahe string `schema:"_,required"`
}

func (o *ordjagt) viewsTryAgain(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("view.tryAgain")
	if err := r.ParseForm(); err != nil {
		log.Error().
			Err(err).
			Msg("view.tryAgain: could not ParseForm")
	}

	var req DefaultGet
	if err := decoder.Decode(&req, r.Form); err != nil {
		log.Error().
			Err(err).
			Msg("view.tryAgain: could not decode form")
	}

	// get user
	user := o.UserGet(req.Mobile)

	triesleft := user.TriesLeft
	score := 0
	personalrecord := -9999
	if len(user.Scores) > 0 {
		score = user.Scores[len(user.Scores)-1]

		for _, score := range user.Scores {
			if score >= personalrecord {
				personalrecord = score
			}
		}
	}

	showSignup := !user.SignedUp
	data := viewsTryAgain{
		Score:          score,
		PersonalRecord: personalrecord,
		TriesLeft:      triesleft,
		ShowSignup:     showSignup,
	}

	o.viewsTryAgainTmpl.Execute(w, data)
}

func (o *ordjagt) viewsSignup(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("view.signup")
	if err := r.ParseForm(); err != nil {
		log.Error().
			Err(err).
			Msg("view.signup: could not ParseForm")
	}

	var req DefaultGet
	if err := decoder.Decode(&req, r.Form); err != nil {
		log.Error().
			Err(err).
			Msg("view.signup: could not decode form")
	}

	// get user
	user := o.UserGet(req.Mobile)

	data := viewsSignup{
		Mobile: user.Userid,
	}

	o.viewsSignupTmpl.Execute(w, data)
}

func (o *ordjagt) viewsGame(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("view.game")

	data := viewsGame{
		Seed: "d07bc074d5#e8e4edf4e0931e2a747b3606fe41e8e40d451d07",
	}

	o.viewsGameTmpl.Execute(w, data)
}

func (o *ordjagt) viewsPhonenumber(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("view.phonenumber")
	o.viewsPhonenumberTmpl.Execute(w, "")
}

func (o *ordjagt) viewsHighscore(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("view.highscore")

	data := viewsHighscore{
		Highscores: o.ScoreBoard,
	}

	o.viewsHighscoreTmpl.Execute(w, data)
}

func (o *ordjagt) viewsHowToPlay(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("view.howToPlay")

	o.viewsHowToPlayTmpl.Execute(w, "")
}
