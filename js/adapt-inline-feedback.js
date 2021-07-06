define([
  'core/js/views/questionView',
  './inlineFeedbackQuestionView'
], function(QuestionView, InlineFeedbackQuestionView) {

  const QuestionViewInitialize = QuestionView.prototype.initialize;
  QuestionView.prototype.initialize = function() {
    if (this.model.get('_canShowFeedback')) {
      _.extend(this, InlineFeedbackQuestionView);
    }
    return QuestionViewInitialize.apply(this, arguments);
  };

});
