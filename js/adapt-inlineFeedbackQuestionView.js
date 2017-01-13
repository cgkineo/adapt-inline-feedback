define([
    'coreJS/adapt',
    'coreViews/questionView'
], function(Adapt, QuestionView) {

    var InlineFeedbackComponentView = {
        postRender: function() {
            // shuffle feedback down DOM
            this.$('.' + this.model.get('_component') + '-inner').append(this.$('.' + this.model.get('_component') + '-feedback'));

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

                $("#a11y-focuser")[0].focus();

                this.$('.' + this.model.get('_component') + '-feedback-message').html(this.model.get('feedbackMessage')).a11y_text();

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
                // trickle, if used, must be set to listen for _isComplete
                this.model.set('_isInteractionComplete', true);
                this.$('.component-widget').addClass('complete show-user-answer');
            }

        },

        onScrolledToFeedback:function() {
            this.setCompletionStatus();
            
            // we need to kick PLP to update because we've changed the order of setting _isComplete/_isInteractionComplete

            var parentPage = this.model.findAncestor('contentObjects');

            if (parentPage.findDescendants('components').where({'_isAvailable': true, '_isOptional': false, '_isComplete':false}).length == 0) {
                // if all page components now complete wait for _isComplete to propagate to page then tell PLP to update
                parentPage.once('change:_isComplete', function() {
                    Adapt.trigger('pageLevelProgress:update');
                })
            } else {
                // otherwise update PLP as normal
                Adapt.trigger('pageLevelProgress:update');
            }
        }
    };

    return InlineFeedbackComponentView;
});
