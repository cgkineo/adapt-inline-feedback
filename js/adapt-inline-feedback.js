define([
    'coreJS/adapt',
    'coreViews/questionView',
    './adapt-inlineFeedbackQuestionView'
], function(Adapt, QuestionView, InlineFeedbackQuestionView) {

    var QuestionViewInitialize = QuestionView.prototype.initialize;

    QuestionView.prototype.initialize = function(options) {
        _.extend(this, InlineFeedbackQuestionView);

        return QuestionViewInitialize.apply(this, arguments);
    };
});