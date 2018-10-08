package main

import (
	"errors"

	"github.com/rs/zerolog/log"
)

var (
	UserNotFoundErr = errors.New("User not found")
)

type UserDetails struct {
	Firstname string
	Surname   string
	Email     string
}

type User struct {
	Userid    string
	Scores    []int
	Details   *UserDetails
	TriesLeft int
	SignedUp  bool
}

type Score struct {
	Name  string
	Score int
}

func (o *ordjagt) UserExists(userid string) error {
	if _, ok := o.Users[userid]; ok != true {
		return UserNotFoundErr
	}

	return nil
}

func (o *ordjagt) UserGet(userid string) *User {
	log.Debug().
		Str("userid", userid).
		Msg("UserGet: getting user")

	if err := o.UserExists(userid); err != nil {
		log.Debug().
			Str("userid", userid).
			Msg("UserGet: user does not exists, creating")

		user := &User{
			Userid:    userid,
			Scores:    []int{},
			Details:   &UserDetails{},
			TriesLeft: 3,
			SignedUp:  false,
		}
		o.Users[userid] = user

		return user
	}
	log.Debug().
		Str("userid", userid).
		Msg("UserGet: user exists, returning user")

	return o.Users[userid]
}

func (o *ordjagt) UserSignup(userid string, details UserDetails) {
	user := o.UserGet(userid)

	user.Details = &details
	user.SignedUp = true

	// if the user has a score, the add it to the highscore (if possible).
	if len(user.Scores) > 0 {
		o.UserAddHighscore(user.Userid, user.Scores[len(user.Scores)-1])
	}
}

func (o *ordjagt) UserAddScore(userid string, score int) {
	log.Debug().Msg("UserAddScore")

	user := o.UserGet(userid)
	if user.TriesLeft < 1 {
		return
	}
	user.TriesLeft -= 1

	o.UserAddPersonalScore(userid, score)
	o.UserAddHighscore(userid, score)
}

func (o *ordjagt) UserAddPersonalScore(userid string, score int) {
	log.Debug().Msg("UserAddPersonalScore")

	user := o.UserGet(userid)
	// append to local highscore
	user.Scores = append(user.Scores, score)
}

func (o *ordjagt) UserAddHighscore(userid string, score int) {
	log.Debug().Msg("UserAddHighscore")

	user := o.UserGet(userid)
	// only append if user is signed up
	if !user.SignedUp {
		return
	}

	for i := 9; i >= 0; i-- {
		log.Debug().Int("i", i).Msg("addScore: looping")
		if score > o.ScoreBoard[i].Score {
			if i == 9 {
				o.ScoreBoard[i] = &Score{Name: user.Details.Firstname, Score: score}
			} else {
				o.ScoreBoard[i+1] = &Score{Name: o.ScoreBoard[i].Name, Score: o.ScoreBoard[i].Score}
				o.ScoreBoard[i] = &Score{Name: user.Details.Firstname, Score: score}
			}
		}
	}
}
