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

                this.populateFeedback();
            }
        },

        populateFeedback:function() {
            var genericTitle = Adapt.course.get('_globals')._extensions._inlineFeedback.feedbackTitle;

            this.$('.' + this.model.get('_component') + '-feedback-title')
                .html(genericTitle || this.model.get('feedbackTitle')).a11y_text()
                .addClass('component-feedback-title');

            this.$('.' + this.model.get('_component') + '-feedback-message').html(this.model.get('feedbackMessage')).a11y_text();
        },

        showFeedback: function() {
            QuestionView.prototype.showFeedback.call(this);

            if (this.model.get('_canShowFeedback')) {

                this.$('.' + this.model.get('_component') + '-feedback').addClass('show-feedback');

                this.populateFeedback();

                var anchorSelector = '.' + this.model.get('_id') + ' .feedback-anchor';
                var feedbackSelector = '.' + this.model.get('_id') + ' .' + this.model.get('_component') + '-feedback';

                // now target a focusable element and focus immediately (a11y_focus defers)...

                // try to focus accessible feedback text if applicable
                if ($(feedbackSelector + ' [tabindex]').length > 0) $(feedbackSelector + ' [tabindex]').focusNoScroll();
                // else try to focus a feedback anchor if present
                else if ($(anchorSelector).length > 0) $(anchorSelector).focusNoScroll();
                // else place focus in a safe place
                else $('#a11y-focuser').focusNoScroll();

                _.delay(_.bind(function() {
                    
                    var selector = this.$('.feedback-anchor').length > 0 ? anchorSelector : feedbackSelector;

                    this.listenToOnce(Adapt, 'page:scrolledTo', this.onScrolledToFeedback);
                    this.scrollTo(selector, { duration: 500 });
                    
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
        },

        // this function is Adapt.scrollTo but with the a11y_focus line commented
        // if we are scrolling to a feedback anchor we do not wish to focus it!
        scrollTo:function(selector, settings) {
            // Get the current location - this is set in the router
            var location = (Adapt.location._contentType) ?
                Adapt.location._contentType : Adapt.location._currentLocation;
            // Trigger initial scrollTo event
            Adapt.trigger(location+':scrollTo', selector);
            //Setup duration variable passed upon arguments
            var settings = (settings || {});
            var disableScrollToAnimation = Adapt.config.has('_disableAnimation') ? Adapt.config.get('_disableAnimation') : false;
            if (disableScrollToAnimation) {
                settings.duration = 0;
            }
            else if (!settings.duration) {
                settings.duration = $.scrollTo.defaults.duration;
            }

            var navigationHeight = $(".navigation").outerHeight();

            if (!settings.offset) settings.offset = { top: -navigationHeight, left: 0 };
            if (settings.offset.top === undefined) settings.offset.top = -navigationHeight;
            if (settings.offset.left === undefined) settings.offset.left = 0;

            if (settings.offset.left === 0) settings.axis = "y";

            if (Adapt.get("_canScroll") !== false) {
            // Trigger scrollTo plugin
            $.scrollTo(selector, settings);
            }

            // Trigger an event after animation
            // 300 milliseconds added to make sure queue has finished
            _.delay(function() {
                // $(selector).a11y_focus();
                Adapt.trigger(location+':scrolledTo', selector);
            }, settings.duration+300);

        }
    };

    return InlineFeedbackComponentView;
});
