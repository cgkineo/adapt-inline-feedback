define([
    'coreJS/adapt',
    'coreViews/questionView'
], function(Adapt, QuestionView) {

    var InlineFeedbackComponentView = {
        postRender: function() {
            // shuffle feedback down DOM
            this.$('.component-inner').append(this.$('.' + this.model.get('_component') + '-feedback'));

            QuestionView.prototype.postRender.call(this);

            if (this.model.get('_isSubmitted')) {
                this.$('.' + this.model.get('_component') + '-feedback').addClass('show-feedback');
                this.$('.' + this.model.get('_component') + '-feedback-title').addClass('component-feedback-title');
            }
        },

        showFeedback: function() {
            QuestionView.prototype.showFeedback.call(this);

            if (this.model.get('_canShowFeedback')) {

                this.$('.' + this.model.get('_component') + '-feedback').addClass('show-feedback');

                this.$('.' + this.model.get('_component') + '-feedback-title')
                    .html(this.model.get('feedbackTitle')).a11y_text()
                    .addClass('component-feedback-title');

                this.$('.' + this.model.get('_component') + '-feedback-message').html(this.model.get('feedbackMessage')).a11y_text();

                //Adapt.trigger('trickle:resize');
                $(window).resize();

                _.delay(_.bind(function() {
                    var selector = '.' + this.model.get('_id') + ' .' + this.model.get('_component') + '-feedback';
                    this.listenToOnce(Adapt, 'page:scrolledTo', this.onScrolledToFeedback);
                    Adapt.scrollTo(selector, { duration: 500 });
                }, this), 250);
            }
        },

        checkQuestionCompletion: function() {

            var isComplete = false;

            if (this.model.get('_isCorrect') || this.model.get('_attemptsLeft') === 0) {
                isComplete = true;
            }

            if (isComplete) {
                // trickle set to listen for _isComplete
                this.model.set('_isInteractionComplete', true);
                this.$('.component-widget').addClass('complete show-user-answer');
            }

        },

        onScrolledToFeedback:function() {
            this.setCompletionStatus();
        }
    };

    return InlineFeedbackComponentView;
});
