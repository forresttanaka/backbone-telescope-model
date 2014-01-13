/*global Backbone:false,_:false */

$(function() {

  // Simple DB of allowed OTA types
  var otaTypes = ['Refractor', 'Newtonian', 'Cassegrain'];

  // Defines one telescope
  var Telescope = Backbone.Model.extend({

    defaults: {
      brand: 'Celestron',
      model: 'CG-11',
      type: otaTypes[2],
      aperture: 279,
      focalLength: 2800,
      focalRatio: 10,
      secondaryMirror: 50,
      weight: 12.5
    },

    // Used to refer to allowed OTA types in model
    otaTypes: otaTypes,

    initialize: function() {
      // When the aperture or focal length changes, recalculate the focal ratio
      this.on('change:focalLength change:aperture', function(model) {
        model.set({focalRatio: model.get('focalLength') / model.get('aperture')});
      });
    }

  });


  var TelescopeView = Backbone.View.extend({

    // Called when this view is instantiated
    initialize: function() {
      // Render the whole form
      this.render();

      // Call updateFocalRatio() when the model's focalRatio value changes
      this.model.on('change:focalRatio', this.updateFocalRatio, this);
    },

    // Render the whole form; must be called explicitly
    render: function() {
      // Compile the template from the targeted <script> tag in our HTML file
      // Template needs the array of allowed OTA types, so add it to model data object
      var modelData = _.extend(this.model.toJSON(), {otaTypes: this.model.otaTypes});
      var template = _.template($('#ota-data-template').html(), modelData);

      // Inject the compiled HTML into this View object's target element
      this.$el.html(template);
    },

    // Update the focalRatio form field
    updateFocalRatio: function() {
      // this.$el is HTML target #ota-data. Get the #focal-ratio element inside it
      // and set its value to our model's focalRatio field
      this.$el.find('#focal-ratio').val(this.model.get('focalRatio'));
    },

    // React to events
    events: {
      // When any fields changed by user, call saveInfo
      "change": "saveInfo"
    },

    // Called when any field value changes in the form. Save the changed field
    // into the corresponding attribute of our model
    saveInfo: function(e) {
      // Changed element in 'e' parm. Get its attribute name. We made attr name match
      // corresponding model member name
      var data = $(e.target).attr('name');
      var value = $(e.target).val();
      this.model.set(data, value);
    }

  });


  var telescope = new Telescope();
  var telescopeView = new TelescopeView({ el: '#ota-data', model: telescope });

});