
((renderer,controller,model) => {
    document.addEventListener("DOMContentLoaded", () => {
        model.init().then(() => {
            renderer.init();
            controller.init();
        });
    });
})(quizRenderer,quizController,quizModel);