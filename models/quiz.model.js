

let quizModel = ((ajax) => {

    let model = {};

    // private properties
    const jsonUrl = "https://cdn.rawgit.com/kdzwinel/cd08d08002995675f10d065985257416/raw/811ad96a0567648ff858b4f14d0096ba241f28ef/quiz-data.json";
    let intervalHandle;


    // public properties
    model.subscribers = {};
    model.timeLeft = 0;
    model.questions = [];
    model.answers = [];
    model.currentQuestion = 0;
    model.score = 0;


    // private methods
    const notifySubscribers = (prop) => {
        if(!model.subscribers[prop]){
            return;
        }
        model.subscribers[prop].forEach((callback) => callback(model[prop]));
    }

    const loadData = (prop) => {
        return ajax.get(jsonUrl).then((data) => {
            data = JSON.parse(data);
            model.questions = data.questions;
            model.questions.forEach(el => model.answers.push("none"));
            model.timeLeft = data.time_seconds;
        }).catch((error) => {
            console.log("Error: ", error);
        });
    }

    const timer = () => {
        if (model.timeLeft === 0) {
            model.stopTimer();
            model.set("currentQuestion",model.questions.length + 1);
            return null;
        }
        if (model.currentQuestion === model.questions.length + 1) {
            model.stopTimer();
            return null;
        }
        model.set("timeLeft", model.timeLeft - 1);
    }


    // public methods
    model.subscribe = (prop, callback) => {
        if (!model.subscribers[prop]) {
            model.subscribers[prop] = [];
        }

        model.get = (prop) => model[prop];
        model.subscribers[prop].push(callback);
    }

    model.set = (prop, value) => {
        if (prop === "currentQuestion" && value === model.questions.length + 1) {
            model.getScore();
        }
        model[prop] = value;
        notifySubscribers(prop);
    }

    model.startTimer = () => {
        intervalHandle = window.setInterval(timer,1000);
    }

    model.stopTimer = () => {
        window.clearInterval(intervalHandle);
    }

    model.init = () => {
        return loadData();
    };

    model.getScore = () => {
        let score = 0;
        for (let i = 0; i < model.questions.length; i++) {
            if (model.answers[i] === "none") {
                break;
            }
            if (model.questions[i].answers[model.answers[i]].correct) {
                score++;
            }
        }
        model.set("score", score);
    }

    return model;
})(ajaxService);