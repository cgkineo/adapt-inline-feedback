define([
  'core/js/adapt',
  'core/js/views/questionView'
], function(Adapt, QuestionView) {

  const InlineFeedbackComponentView = {

    postRender() {
      this.$el.addClass('has-inline-feedback');
      this.renderFeedbackContainer();
      QuestionView.prototype.postRender.call(this);
      if (!this.model.get('_isSubmitted')) return;
      this.populateFeedback();
    },

    renderFeedbackContainer() {
      this.$('.component__inner').append(Handlebars.templates.inlineFeedback());
    },

    populateFeedback: function() {
      const $feedbackMessage = this.$feedback('.component__feedback-content');
      $feedbackMessage.html(this.model.get('feedbackMessage'));
      this.$feedback().addClass('show-feedback');
      if (!this.model.get('feedbackImage')) {
        this.$feedback('.component__feedback-image-container').css('display', 'none');
        $feedbackMessage.css('width', 'auto');
        return;
      }
      const $feedbackImage = this.$feedback('.component__feedback-image');
      $feedbackImage.attr('src', this.model.get('feedbackImage'));
      if (this.model.get('feedbackImageAlt')) $feedbackImage.attr('aria-label', this.model.get('feedbackImageAlt'));
    },

    $feedback(selector) {
      const isParentBlock = (this.$('.component__feedback').length === 0);
      const model = isParentBlock ? this.model.getParent() : this.model;
      const $feedback = $('.' + model.get('_id') + ' .component__feedback');
      return selector ? $feedback.find(selector) : $feedback;
    },

    showFeedback: function() {
      if (this.model.get('_canShowFeedback')) {
        this.populateFeedback();
        this.scrollToFeedback();
      }
      QuestionView.prototype.showFeedback.call(this);
    },

    checkQuestionCompletion: function() {
      const isComplete = (this.model.get('_isCorrect') || this.model.get('_attemptsLeft') === 0);
      if (!isComplete) return;
      // trickle, if used, must be set to listen for _isComplete
      this.model.set('_isInteractionComplete', true);
      this.$('.component__widget').addClass('is-complete show-user-answer');
    },

    scrollToFeedback() {
      const $anchor = this.$anchor();
      const $feedback = this.$feedback();
      const $target = $feedback.length ? $feedback : $anchor;
      _.delay(() => {
        $.scrollTo($target, {
          offset: -($('.nav').outerHeight() + 100),
          duration: 500,
          onAfter: this.onScrolledToFeedback.bind(this)
        });
      }, 250);
    },

    $anchor() {
      return $('.' + this.model.get('_id') + ' .feedback-anchor');
    },

    onScrolledToFeedback() {
      this.setCompletionStatus();
      // we need to kick PLP to update because we've changed the order of setting _isComplete/_isInteractionComplete
      const parentPage = this.model.findAncestor('contentObjects');
      if (parentPage.findDescendantModels('components', { where: { _isAvailable: true, _isOptional: false, _isComplete: false } }).length === 0) {
        // if all page components now complete wait for _isComplete to propagate to page then tell PLP to update
        parentPage.once('change:_isComplete', function() {
          Adapt.trigger('pageLevelProgress:update');
        });
        return;
      }
      // otherwise update PLP as normal
      Adapt.trigger('pageLevelProgress:update');
    }

  };

  return InlineFeedbackComponentView;

});
