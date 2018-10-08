package main

import (
	"errors"
	"fmt"

	"github.com/rs/zerolog/log"
)

var (
	UserNotFoundErr = errors.New("User not found")
)

type User struct {
	Name      string
	Userid    string
	Scores    []int
	TriesLeft int
	SignedUp  bool
}

type Score struct {
	Name  string
	Score int
}

// type ordjagt struct {
// type ordjagt struct {
// 	Users      map[string]*user
// 	Scoreboard map[int]score
// }
// 	Users      map[string]*user
// 	Scoreboard map[int]score
// }

// func main() {
// 	ord := &ordjagt{
// 		Users: map[string]*user{
// 			"18888888": {
// 				Name:   "test",
// 				Userid: "18888888",
// 				Scores: []int{1, 2, 3, 4, 5},
// 			},
// 			"28888888": {
// 				Name:   "test",
// 				Userid: "28888888",
// 				Scores: []int{1, 2, 3, 4, 5},
// 			},
// 			"38888888": {
// 				Name:   "test",
// 				Userid: "38888888",
// 				Scores: []int{1, 2, 3, 4, 5},
// 			},
// 			"48888888": {
// 				Name:   "test",
// 				Userid: "48888888",
// 				Scores: []int{1, 2, 3, 4, 5},
// 			},
// 			"58888888": {
// 				Name:   "test",
// 				Userid: "58888888",
// 				Scores: []int{1, 2, 3, 4, 5},
// 			},
// 		},
// 	}

// 	fmt.Println(ord)
// 	ord.AddScore("18888888", 100)
// }

// - AddScore (user score and highscore) error
// - UserExists bool
// -

func (o *ordjagt) UserExists(userid string) error {
	if _, ok := o.Users[userid]; ok != true {
		return UserNotFoundErr
	}

	return nil
}

func (o *ordjagt) GetUser(userid string) *User {
	log.Debug().
		Str("userid", userid).
		Msg("GetUser: getting user")

	if err := o.UserExists(userid); err != nil {
		log.Debug().
			Str("userid", userid).
			Msg("GetUser: user does not exists, creating")

		user := &User{
			Name:      "",
			Userid:    userid,
			Scores:    []int{},
			TriesLeft: 3,
			SignedUp:  false,
		}
		o.Users[userid] = user

		return user
	}
	log.Debug().
		Str("userid", userid).
		Msg("GetUser: user exists, returning user")

	return o.Users[userid]
}

func (o *ordjagt) AddScore(userid string, score int) {
	log.Debug().Msg("AddScore")

	user := o.GetUser(userid)

	fmt.Println(user)
	// append to local highscore
	user.Scores = append(user.Scores, score)

	for i := 9; i >= 0; i-- {
		log.Debug().Int("i", i).Msg("addScore: looping")
		if score > o.ScoreBoard[i].Score {
			if i == 9 {
				o.ScoreBoard[i] = &Score{Name: userid, Score: score}
			} else {
				o.ScoreBoard[i+1] = &Score{Name: o.ScoreBoard[i].Name, Score: o.ScoreBoard[i].Score}
				o.ScoreBoard[i] = &Score{Name: userid, Score: score}
			}
		}
	}

}
