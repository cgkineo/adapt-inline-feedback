Uninstall adapt-contrib-tutor. Add to components.hbs:

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

