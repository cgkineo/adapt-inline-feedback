# adapt-inline-feedback

Display question feedback in situ rather than in a popup ([adapt-contrib-tutor](https://github.com/adaptlearning/adapt-contrib-tutor)).

##Installation

* Download into ``src/extensions`` folder
* Uninstall [adapt-contrib-tutor]()
* Add to components.hbs:

```
<div class="component__feedback inline__feedback">
  <div class="component__feedback-inner inline__feedback-inner">

    <div class="component__feedback-content">
      <div class="component__feedback-title" tabindex="0" role="region"></div>
      <div class="component__feedback-message"></div>
    </div>

    <div class="component__feedback-image-container">
      <img class="component__feedback-image"/>
    </div>

  </div>
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
