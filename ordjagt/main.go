package ordjagt

import (
	"encoding/base64"
	"fmt"
	"html/template"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/schema"
	"github.com/rs/zerolog/log"
)

var decoder = schema.NewDecoder()

type OrdjagtConfig struct {
	Name          string
	EncryptionKey string
	BindAddress   string
	Port          int
}

type ordjagt struct {
	Conf          *OrdjagtConfig
	ScoreBoard    map[int]*Score
	Users         map[string]*User
	EncryptionKey string

	viewsIndexTmpl       *template.Template
	viewsHowToPlayTmpl   *template.Template
	viewsTryAgainTmpl    *template.Template
	viewsHighscoreTmpl   *template.Template
	viewsGameTmpl        *template.Template
	viewsSignupTmpl      *template.Template
	viewsPhonenumberTmpl *template.Template
	viewsPricesTmpl      *template.Template
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
	http.ListenAndServe(fmt.Sprintf("%s:%d", o.Conf.BindAddress, o.Conf.Port), nil)
}

func New(conf OrdjagtConfig) (*ordjagt, error) {
	encKey, _ := base64.StdEncoding.DecodeString(conf.EncryptionKey)
	log.Debug().Str("encKey", string(encKey[:])).Msg("test")

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
		EncryptionKey:        string(encKey[:]),
		viewsIndexTmpl:       template.Must(template.ParseFiles("./ordjagt/website/index.html")),
		viewsHowToPlayTmpl:   template.Must(template.ParseFiles("./ordjagt/website/views/how_to_play.php")),
		viewsTryAgainTmpl:    template.Must(template.ParseFiles("./ordjagt/website/views/try_again.php")),
		viewsHighscoreTmpl:   template.Must(template.ParseFiles("./ordjagt/website/views/highscore.php")),
		viewsGameTmpl:        template.Must(template.ParseFiles("./ordjagt/website/views/game.php")),
		viewsSignupTmpl:      template.Must(template.ParseFiles("./ordjagt/website/views/signup.php")),
		viewsPhonenumberTmpl: template.Must(template.ParseFiles("./ordjagt/website/views/phonenumber.php")),
		viewsPricesTmpl:      template.Must(template.ParseFiles("./ordjagt/website/views/see_prices.php")),
	}

	r := mux.NewRouter()

	r.HandleFunc("/", s.viewsIndex)
	r.HandleFunc("/ajax/save_mobile.php", s.ajaxSaveMobile)
	r.HandleFunc("/ajax/game_over.php", s.ajaxGameOver)
	r.HandleFunc("/ajax/redirect_to.php", s.ajaxRedirectTo)
	r.HandleFunc("/ajax/save_main_competition.php", s.ajaxSignup)
	r.HandleFunc("/views/views_how_to_play.php", s.viewsHowToPlay)
	r.HandleFunc("/views/try_again.php", s.viewsTryAgain)
	r.HandleFunc("/views/highscore.php", s.viewsHighscore)
	r.HandleFunc("/views/game.php", s.viewsGame)
	r.HandleFunc("/views/phonenumber.php", s.viewsPhonenumber)
	r.HandleFunc("/views/how_to_play.php", s.viewsHowToPlay)
	r.HandleFunc("/views/signup.php", s.viewsSignup)
	r.HandleFunc("/views/see_prices.php", s.viewsPrices)

	serveStatic(r, "./ordjagt/website/css", "/css/")
	serveStatic(r, "./ordjagt/website/fonts", "/fonts/")
	serveStatic(r, "./ordjagt/website/game", "/game/")
	serveStatic(r, "./ordjagt/website/images", "/images/")
	serveStatic(r, "./ordjagt/website/js", "/js/")

	http.Handle("/", r)
	return s, nil
}
