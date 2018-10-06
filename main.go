package main

import (
	"fmt"
	"os"
	"strconv"

	"html/template"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

type OrdjagtConfig struct {
	Name          string
	EncryptionKey string
}

type user struct {
	name       string
	highscores *[]int
}

type highscore struct {
	Name  string
	Score int
}

type ordjagt struct {
	conf       *OrdjagtConfig
	scoreBoard map[int]highscore
	users      map[string]user

	viewsIndexTmpl       *template.Template
	viewsHowToPlayTmpl   *template.Template
	viewsTryAgainTmpl    *template.Template
	viewsHighscoreTmpl   *template.Template
	viewsGameTmpl        *template.Template
	viewsPhonenumberTmpl *template.Template
}

type viewsTryAgain struct {
	Score          int
	PersonalRecord int
	TriesLeft      int
}

type viewsHighscore struct {
	Highscores map[int]highscore
}

type viewsGame struct {
	Seed string
}

func (o *ordjagt) addScore(userId string, score int) {
	log.Debug().Msg("addScore")

	// check if user exists
	if _, present := o.users[userId]; present == false {
		o.users[userId] = user{name: userId, highscores: &[]int{}}
	}

	high := *o.users[userId].highscores
	high = append(high, score)

	log.Debug().Msg("addScore: added personal score")

	for i := 9; i >= 0; i-- {
		log.Debug().Int("i", i).Msg("addScore: looping")
		if score > o.scoreBoard[i].Score {
			if i == 9 {
				o.scoreBoard[i] = highscore{Name: userId, Score: score}
			} else {
				o.scoreBoard[i+1] = highscore{Name: o.scoreBoard[i].Name, Score: o.scoreBoard[i].Score}
				o.scoreBoard[i] = highscore{Name: userId, Score: score}
			}
		}
	}

	fmt.Println(o.scoreBoard)
}

func (o *ordjagt) ajaxGameOver(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	log.Debug().Msg("ajax.GameOver")

	for k, v := range r.Form {
		fmt.Printf("%s = %s\n", k, v)
	}

	score, _ := strconv.Atoi(r.Form["score"][0])
	mobile := r.Form["mobile"][0]
	o.addScore(mobile, score)

	fmt.Fprintf(w, "try_again")
}

func (o *ordjagt) ajaxRedirectTo(w http.ResponseWriter, r *http.Request) {
	// fmt.Fprintf(w, `{"error": false, "tries_left": 1}`)
	fmt.Fprintf(w, `{"tries_left": 3}`)
}

func serveStatic(r *mux.Router, dir, path string) {
	log.Debug().
		Str("dir", dir).
		Str("path", path).
		Msg("static route added")

	fs := http.FileServer(http.Dir(dir))
	r.PathPrefix(path).Handler(http.StripPrefix(path, fs))
}

func (o *ordjagt) viewsIndex(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("view.index")
	o.viewsIndexTmpl.Execute(w, "")
}

func (o *ordjagt) viewsTryAgain(w http.ResponseWriter, request *http.Request) {
	log.Debug().Msg("view.tryAgain")

	data := viewsTryAgain{
		Score:          1,
		PersonalRecord: 99999,
		TriesLeft:      0,
	}

	o.viewsTryAgainTmpl.Execute(w, data)
}

func (o *ordjagt) viewsGame(w http.ResponseWriter, request *http.Request) {
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

func (o *ordjagt) viewsHighscore(w http.ResponseWriter, request *http.Request) {
	log.Debug().Msg("view.highscore")

	data := viewsHighscore{
		Highscores: o.scoreBoard,
	}

	o.viewsHighscoreTmpl.Execute(w, data)
}

func (o *ordjagt) viewsHowToPlay(w http.ResponseWriter, request *http.Request) {
	log.Debug().Msg("view.howToPlay")

	o.viewsHowToPlayTmpl.Execute(w, "")
}

func (o *ordjagt) ajaxSaveMobile(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("ajax.saveMobile")

	r.ParseForm()
	mobile := r.Form["mobile"][0]
	o.users[mobile] = user{name: mobile, highscores: &[]int{}}

	fmt.Fprintf(w, "true")
}

func (o *ordjagt) Run() {
	log.Debug().Msg("Running ordjagt!")
	http.ListenAndServe(":5000", nil)
}

func New(conf OrdjagtConfig) (*ordjagt, error) {
	s := &ordjagt{
		conf: &conf,
		scoreBoard: map[int]highscore{
			0: {Name: "-", Score: 0},
			1: {Name: "-", Score: 0},
			2: {Name: "-", Score: 0},
			3: {Name: "-", Score: 0},
			4: {Name: "-", Score: 0},
			5: {Name: "-", Score: 0},
			6: {Name: "-", Score: 0},
			7: {Name: "-", Score: 0},
			8: {Name: "-", Score: 0},
			9: {Name: "-", Score: 0},
		},
		users:                make(map[string]user),
		viewsIndexTmpl:       template.Must(template.ParseFiles("./website/index.html")),
		viewsHowToPlayTmpl:   template.Must(template.ParseFiles("./website/views/how_to_play.php")),
		viewsTryAgainTmpl:    template.Must(template.ParseFiles("./website/views/try_again.php")),
		viewsHighscoreTmpl:   template.Must(template.ParseFiles("./website/views/highscore.php")),
		viewsGameTmpl:        template.Must(template.ParseFiles("./website/views/game.php")),
		viewsPhonenumberTmpl: template.Must(template.ParseFiles("./website/views/phonenumber.php")),
	}

	r := mux.NewRouter()
	// serveStatic(r, "./website/ajax", "/ajax/")

	r.HandleFunc("/", s.viewsIndex)
	r.HandleFunc("/ajax/save_mobile.php", s.ajaxSaveMobile)
	r.HandleFunc("/ajax/game_over.php", s.ajaxGameOver)
	r.HandleFunc("/ajax/redirect_to.php", s.ajaxRedirectTo)
	r.HandleFunc("/views/views_how_to_play.php", s.viewsHowToPlay)
	r.HandleFunc("/views/try_again.php", s.viewsTryAgain)
	r.HandleFunc("/views/highscore.php", s.viewsHighscore)
	r.HandleFunc("/views/game.php", s.viewsGame)
	r.HandleFunc("/views/phonenumber.php", s.viewsPhonenumber)

	serveStatic(r, "./website/css", "/css/")
	serveStatic(r, "./website/fonts", "/fonts/")
	serveStatic(r, "./website/game", "/game/")
	serveStatic(r, "./website/images", "/images/")
	serveStatic(r, "./website/js", "/js/")
	serveStatic(r, "./website/views", "/views/")

	http.Handle("/", r)
	return s, nil
}

func main() {
	zerolog.SetGlobalLevel(zerolog.DebugLevel)
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})

	conf := OrdjagtConfig{
		Name:          "test",
		EncryptionKey: "key",
	}
	s, _ := New(conf)
	s.Run()
}
