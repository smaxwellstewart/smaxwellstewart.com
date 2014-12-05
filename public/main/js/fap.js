/*!
 * jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
 * Author: @addyosmani
 * Further changes: @peolanha
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

    // define your widget under a namespace of your choice
    //  with additional parameters e.g.
    // $.widget( "namespace.widgetname", (optional) - an
    // existing widget prototype to inherit from, an object
    // literal to become the widget's prototype );

    $.widget( "fap.searches" , {

        //Options to be used as defaults
        options: {
            someValue: null
        },

        //Setup widget (eg. element creation, apply theming
        // , bind events etc.)
        _create: function () {

            // _create will automatically run the first time
            // this widget is called. Put the initial widget
            // setup code here, then you can access the element
            // on which the widget was called via this.element.
            // The options defined above can be accessed
            // via this.options this.element.addStuff();
            this.makePie();
            this.makeHits();
            this.makeSummary();

            var search = $('.search');

            search.html(function(index, oldHtml) {
                return oldHtml.replace(/\b(\w+?)\b/g, '<span class="word">$1</span>')
            });

            search.click(function(event) {
              window.location.href = '/labs/fap-searches?keyword='+event.target.innerHTML;
            });
        },
        makePie: function() {
          var segments = this.options.segments;
          $('#container').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,//null,
                plotShadow: false
            },
            title: {
                text: 'Segment Breakdown',
                verticalAlign: 'top',
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y}',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Percentage of total',
                data: [
                    ['Gay',   segments.g],
                    ['Straight',       segments.s],
                    ['Trans',    segments.t]
                ]
            }]
          });
        },
        makeHits: function() {
          var self = this;
          var hits = this.options.topHits;
          $.each(hits, function(index, elem) {
            var hit = self.makeHit(elem);
            $('.topHits').append(hit);
          })
        },
        makeHit: function(hit) {
          var output = '<div class="col-xs-8"><h4 class="search">'+hit._id+'</h4></div><div class="col-xs-4"><h4 style="color: grey;">'+hit.hits+' hits</h4></div>';
          return output;
        },
        makeSummary: function() {
          var items = this.options.items;
          $('.numResults').html($.number(items.total, 0));
          $('.perResults').html($.number(items.percent, 4));
        },
        //{point.percentage:.1f}

        // Destroy an instantiated plugin and clean up
        // modifications the widget has made to the DOM
        destroy: function () {

            // this.element.removeStuff();
            // For UI 1.8, destroy must be invoked from the
            // base widget
            $.Widget.prototype.destroy.call(this);
            // For UI 1.9, define _destroy instead and don't
            // worry about
            // calling the base widget
        },


        methodB: function ( event ) {
            //_trigger dispatches callbacks the plugin user
            // can subscribe to
            // signature: _trigger( "callbackName" , [eventObject],
            // [uiObject] )
            // eg. this._trigger( "hover", e /*where e.type ==
            // "mouseenter"*/, { hovered: $(e.target)});
            console.log("methodB called");
        },

        methodA: function ( event ) {
            this._trigger("dataChanged", event, {
                key: "someValue"
            });
        },

        // Respond to any changes the user makes to the
        // option method
        _setOption: function ( key, value ) {
            switch (key) {
            case "someValue":
                //this.options.someValue = doSomethingWith( value );
                break;
            default:
                //this.options[ key ] = value;
                break;
            }

            // For UI 1.8, _setOption must be manually invoked
            // from the base widget
            $.Widget.prototype._setOption.apply( this, arguments );
            // For UI 1.9 the _super method can be used instead
            // this._super( "_setOption", key, value );
        }
    });

})( jQuery, window, document );
