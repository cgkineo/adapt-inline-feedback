# adapt-inline-feedback

Display question feedback in situ rather than in a popup ([adapt-contrib-tutor]()).

##Installation

* Download into ``src/extensions`` folder
* Uninstall [adapt-contrib-tutor]()
* Add to components.hbs:
```
<div class="{{_component}}-feedback component-feedback">
    <div class="{{_component}}-feedback-title">
        {{#if feedbackTitle}}
            {{{a11y_text feedbackTitle}}}
        {{/if}}
    </div>

    <div class="{{_component}}-feedback-message">
        {{#if feedbackMessage}}
            {{{a11y_text feedbackMessage}}}
        {{/if}}
    </div>
</div>
```
N.B. if using [cgkineo/adapt-contrib-confidenceSlider]() ```showFeedback``` must not be overridden. Instead, override ```setupFeedback```:

```
setupFeedback: function() {
    this.model.set('feedbackTitle', this.model.get('title'));
    this.model.set('feedbackMessage', this.getFeedbackString());
}
```
