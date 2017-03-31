# adapt-inline-feedback

Display question feedback in situ rather than in a popup ([adapt-contrib-tutor](https://github.com/adaptlearning/adapt-contrib-tutor)).

## Installation

* Download into ``src/extensions`` folder
* Uninstall [adapt-contrib-tutor](https://github.com/adaptlearning/adapt-contrib-tutor)
* Add the template code to components.hbs:
```
<div class="{{_component}}-feedback component-feedback">
    <div class="{{_component}}-feedback-title"></div>
    <div class="{{_component}}-feedback-message"></div>
</div>
```
The template is moved to be the last child of `component-inner` during `postRender`.

## Usage

When feedback becomes available the extension will scroll it into view, aligning it to the **top** of the visible area by default. This behaviour can be modified in two ways:

* If feedback should be aligned to the **bottom** of the visible area, add the property `_onScrollToAlignToBottom` to `_feedback` and set its value to `true`. This can be useful to minimise the distraction of content that follows the question.
* Add an element with the class `feedback-anchor` to the relevant question template(s). This permits custom alignment of the feedback. This can be useful if the question text/options should remain visible (screen space permitting). Note that this is a global change to question types (as opposed to the above which is done for each question instance).

If a generic feedback title is required, specify it in course.json via `_globals._extensions._inlineFeedback.feedbackTitle`.

## Important

If used with [adapt-contrib-trickle](https://github.com/adaptlearning/adapt-contrib-trickle), trickle must listen to `_isComplete` rather than the default `_isInteractionComplete` (see `_completionAttribute` in trickle documentation).

## Notes

N.B. if using an old version of [adapt-contrib-confidenceSlider](https://github.com/cgkineo/adapt-contrib-confidenceSlider) ```showFeedback``` must not be overridden. Instead, override ```setupFeedback```:

```
setupFeedback: function() {
    this.model.set('feedbackTitle', this.model.get('title'));
    this.model.set('feedbackMessage', this.getFeedbackString());
}
```