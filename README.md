# adapt-inline-feedback

Display question feedback in situ rather than in a popup ([adapt-contrib-tutor](https://github.com/adaptlearning/adapt-contrib-tutor)).

##Installation

* Download into ``src/extensions`` folder
* Uninstall [adapt-contrib-tutor]()
* Add to components.hbs:
```
<div class="{{_component}}-feedback component-feedback">
    <div class="{{_component}}-feedback-title component-feedback-title"></div>
    <div class="{{_component}}-feedback-message component-feedback-message"></div>
</div>
```
If a generic feedback title is required, specify it in course.json via `_globals._extensions._inlineFeedback.feedbackTitle`.

N.B. if using [adapt-contrib-confidenceSlider](https://github.com/cgkineo/adapt-contrib-confidenceSlider) ```showFeedback``` must not be overridden. Instead, override ```setupFeedback```:

```
setupFeedback: function() {
    this.model.set('feedbackTitle', this.model.get('title'));
    this.model.set('feedbackMessage', this.getFeedbackString());
}
```

If used with [adapt-contrib-trickle](https://github.com/adaptlearning/adapt-contrib-trickle), trickle must listen to _isComplete rather than _isInteractionComplete (see trickle documentation).
