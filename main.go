package main

import (
	"html/template"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/gorilla/schema"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

var decoder = schema.NewDecoder()

type OrdjagtConfig struct {
	Name          string
	EncryptionKey string
}

type ordjagt struct {
	Conf       *OrdjagtConfig
	ScoreBoard map[int]*Score
	Users      map[string]*User

	viewsIndexTmpl       *template.Template
	viewsHowToPlayTmpl   *template.Template
	viewsTryAgainTmpl    *template.Template
	viewsHighscoreTmpl   *template.Template
	viewsGameTmpl        *template.Template
	viewsSignupTmpl      *template.Template
	viewsPhonenumberTmpl *template.Template
}

func serveStatic(r *mux.Router, dir, path string) {
	log.Debug().
		Str("dir", dir).
		Str("path", path).
		Msg("static route added")

	fs := http.FileServer(http.Dir(dir))
	r.PathPrefix(path).Handler(http.StripPrefix(path, fs))
}

func (o *ordjagt) Run() {
	log.Debug().Msg("Running ordjagt!")
	http.ListenAndServe(":5000", nil)
}

func New(conf OrdjagtConfig) (*ordjagt, error) {
	s := &ordjagt{
		Conf: &conf,
		ScoreBoard: map[int]*Score{
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
		Users:                map[string]*User{},
		viewsIndexTmpl:       template.Must(template.ParseFiles("./website/index.html")),
		viewsHowToPlayTmpl:   template.Must(template.ParseFiles("./website/views/how_to_play.php")),
		viewsTryAgainTmpl:    template.Must(template.ParseFiles("./website/views/try_again.php")),
		viewsHighscoreTmpl:   template.Must(template.ParseFiles("./website/views/highscore.php")),
		viewsGameTmpl:        template.Must(template.ParseFiles("./website/views/game.php")),
		viewsSignupTmpl:      template.Must(template.ParseFiles("./website/views/signup.php")),
		viewsPhonenumberTmpl: template.Must(template.ParseFiles("./website/views/phonenumber.php")),
	}

	s.AddScore("88888888", 10)

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
