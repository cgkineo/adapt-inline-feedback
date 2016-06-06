define([
    'coreJS/adapt',
    'coreViews/questionView'
], function(Adapt, QuestionView) {

    var InlineFeedbackComponentView = {
    	postRender: function() {
    		// shuffle feedback down DOM
    		this.$('.'+this.model.get('_component')+'-inner').append(this.$('.'+this.model.get('_component')+'-feedback'));

    		QuestionView.prototype.postRender.call(this);

            if (this.model.get('_isSubmitted')) {
                this.$('.'+this.model.get('_component')+'-feedback').addClass('show-feedback');  
                this.$('.'+this.model.get('_component')+'-feedback-title').addClass('component-feedback-title'); 
            }
    	},

		showFeedback: function() {
			QuestionView.prototype.showFeedback.call(this);

            if (this.model.get('_canShowFeedback')) {

                this.$('.'+this.model.get('_component')+'-feedback').addClass('show-feedback'); 
    			
    			this.$('.'+this.model.get('_component')+'-feedback-title')
                    .html(this.model.get('feedbackTitle')).a11y_text()
                    .addClass('component-feedback-title');

    			this.$('.'+this.model.get('_component')+'-feedback-message').html(this.model.get('feedbackMessage')).a11y_text();

    			Adapt.scrollTo('.'+this.model.get('_id')+' .'+this.model.get('_component')+'-feedback', {duration:500});
            }
		}
    };

    return InlineFeedbackComponentView;
});