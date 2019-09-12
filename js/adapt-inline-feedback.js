define([
  'coreJS/adapt',
  'coreViews/questionView',
  './adapt-inlineFeedbackQuestionView'
], function(Adapt, QuestionView, InlineFeedbackQuestionView) {

  var QuestionViewInitialize = QuestionView.prototype.initialize;

  QuestionView.prototype.initialize = function(options) {
    if (this.model.get('_canShowFeedback')) {
      _.extend(this, InlineFeedbackQuestionView);
    }

    return QuestionViewInitialize.apply(this, arguments);
  };

});
