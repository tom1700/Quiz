
let quizRenderer = ((model) => {

    let renderer = {};

    // private properties
    let mainPageTemplate;
    let quizPageTemplate;
    let summaryTemplate;
    let questionSummaryTemplate;
    let pageContainer;
    let pages = [];
    let currentPage = 0;
    let templateString = "";
    let timerMinutes;
    let timerSeconds;
    let score;
    let maxScore;
    let summaryContainer;

    // public properties


    // private methods
    const createQuestionSummary = (question,answer) => {
        let html = questionSummaryTemplate
            .replace(/%question/,question.question)
            .replace(/%answer1/,question.answers[0].answer)
            .replace(/%answer2/,question.answers[1].answer)
            .replace(/%answer3/,question.answers[2].answer)
            .replace(/%answer4/,question.answers[3].answer);
        if (question.answers[0].correct) {
            html = html.replace(/%proper-1/,"q-summary__answer--proper");
        }
        if (question.answers[1].correct) {
            html = html.replace(/%proper-2/,"q-summary__answer--proper");
        }
        if (question.answers[2].correct) {
            html = html.replace(/%proper-3/,"q-summary__answer--proper");
        }
        if (question.answers[3].correct) {
            html = html.replace(/%proper-4/,"q-summary__answer--proper");
        }
        if (!question.answers[0].correct && answer === "0") {
            html = html.replace(/%proper-1/,"q-summary__answer--wrong");
        }
        else{
            html = html.replace(/%proper-1/,"");
        }
        if (!question.answers[1].correct && answer === "1") {
            html = html.replace(/%proper-2/,"q-summary__answer--wrong");
        }
        else{
            html = html.replace(/%proper-2/,"");
        }
        if (!question.answers[2].correct && answer === "2") {
            html = html.replace(/%proper-3/,"q-summary__answer--wrong");
        }
        else{
            html = html.replace(/%proper-3/,"");
        }
        if (!question.answers[3].correct && answer === "3") {
            html = html.replace(/%proper-4/,"q-summary__answer--wrong");
        }
        else{
            html = html.replace(/%proper-4/,"");
        }

        return html;
    }

    const buildSummaryString = () => {
        let summaryString = "";
        for( let i = 0; i < model.get("questions").length; i++) {
            summaryString += createQuestionSummary(model.get("questions")[i], model.get("answers")[i]);
        }
        summaryContainer.innerHTML = summaryString;
    }

    const buildPagesString = () => {
        let questions = model.get("questions");
        templateString += mainPageTemplate
            .replace(/%questionsAmount/, questions.length)
            .replace(/%time/, Math.floor(model.get("timeLeft")/60));
        questions.forEach((el) => {
            let newPage = quizPageTemplate
                .replace(/%id/g,"page-"+el.id)
                .replace(/%question/, el.question)
                .replace(/%answer1/, el.answers[0].answer)
                .replace(/%answer2/, el.answers[1].answer)
                .replace(/%answer3/, el.answers[2].answer)
                .replace(/%answer4/, el.answers[3].answer);
            templateString += "\n"+newPage;
            pages.push("page-"+el.id);
        });
        let summaryPage = summaryTemplate.replace(/%id/g,"page-"+(questions.length + 1));
        templateString += "\n"+summaryPage;
        pages.push("page-"+(questions.length + 1));
        pageContainer.innerHTML = templateString;
    }

    const updateTimer = () => {
        let time = model.get("timeLeft");
        let minutes = Math.floor(time/60);
        if (minutes < 10) {
           minutes = "0" + minutes;
        }
        let seconds = Math.floor(time%60);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        timerMinutes.textContent = minutes;
        timerSeconds.textContent = seconds;
    }

    const updateScore = () => {
        let max = model.get("questions").length;
        score.innerHTML = model.get("score");
        maxScore.innerHTML = max;
    }


    // public methods
    renderer.init = () => {

        pageContainer = document.getElementById("q-view").firstElementChild;
        mainPageTemplate = document.getElementById("main-page").innerHTML;
        quizPageTemplate = document.getElementById("quiz-page").innerHTML;
        summaryTemplate = document.getElementById("summary-page").innerHTML;
        questionSummaryTemplate = document.getElementById("question-summary").innerHTML;
        pages.push("page-0");
        buildPagesString();

        renderer.render();

        score = document.getElementById("score");
        maxScore = document.getElementById("max-score");
        timerMinutes = document.getElementById("q-timer__minutes");
        timerSeconds = document.getElementById("q-timer__seconds");
        summaryContainer = document.getElementById("summary-list");

        updateTimer();
    }

    renderer.render = () => {
        if (currentPage === model.get("currentQuestion")) {
            return;
        }
        let oldPage = document.getElementById(pages[currentPage]);
        let newPage = document.getElementById(pages[model.get("currentQuestion")]);

        oldPage.className += " q-page--hide";
        newPage.className = newPage.className.replace(" q-page--hide","");
        currentPage = model.get("currentQuestion");

        if (currentPage === model.get("questions").length + 1) {
            buildSummaryString();
        }
    }


    //init
    model.subscribe("currentQuestion", () => {
        renderer.render();
    });

    model.subscribe("timeLeft", updateTimer);

    model.subscribe("score", updateScore);

    return renderer;
})(quizModel);