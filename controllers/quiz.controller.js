
let quizController = ((model) => {

    let controller = {};

    // private properties
    // public properties


    // private methods
    const start = () => {
        model.set("currentQuestion",1);
        model.startTimer();
    }

    const next = () => {
        model.set("currentQuestion", model.get("currentQuestion") + 1);
    }

    const setAnswer = (ev) => {
        let pageId;
        let answerIndex;
        let questionIndex;
        let answers = model.get("answers");
        [pageId, answerIndex] = ev.target.id.split("-radio-");
        questionIndex = parseInt(pageId.replace("page-","") - 1);
        answers[questionIndex] = answerIndex;
        model.set("answers",answers);
        document.getElementById(pageId+"-submit").removeAttribute("disabled");
        document.getElementById(pageId+"-submit").className = document.getElementById(pageId+"-submit").className.replace("sg-button-primary--disabled","");
    }

    const addListeners = () => {
        document.getElementById("quiz__start").addEventListener("click",start);
        model.get("questions").forEach((el) => {
            document.getElementById("page-" + el.id + "-submit").addEventListener("click",next);
            document.getElementsByName("page-" + el.id + "-radio").forEach(radio => radio.addEventListener("click",setAnswer));
        });
    }


    // public methods
    controller.init = () => {
        addListeners();
    }


    return controller;
})(quizModel);