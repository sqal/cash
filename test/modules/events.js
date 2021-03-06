
var fixture = '\
  <div class="parent">\
    <div class="event">\
      <div class="child"></div>\
    </div>\
  </div>\
';

describe ( 'Events', { beforeEach: getFixtureInit ( fixture ) }, function () {

  describe ( '$.fn.on', function ( it ) {

    it ( 'attaches to single event', function ( t ) {

      var ele = $('.event');
      var count = 0;
      var that;

      function handler () {
        count++;
        that = this;
      }

      ele.on ( 'click', handler );
      ele.trigger ( 'click' ).trigger ( 'click' );

      t.is ( count, 2 );
      t.is ( that, ele[0] );

    });

    it ( 'attaches to multiple events', function ( t ) {

      var ele = $('.event');
      var count = 0;

      function handler () {
        count++;
      }

      ele.on ( 'foo bar', handler );
      ele.trigger ( 'foo' ).trigger ( 'bar' );

      t.is ( count, 2 );

    });

    it ( 'stops propagation if false is returned', function ( t ) {

      var ele = $('.event');
      var parent = $('.parent');
      var count = 0;

      function handler () {
        count++;
        return false;
      }

      parent.on ( 'foo', handler );
      parent.on ( 'foo', handler );
      ele.on ( 'foo', handler );
      ele.on ( 'foo', handler ); // We are not using `stopImmediatePropagation`
      ele.trigger ( 'foo' );

      t.is ( count, 2 );

    });

    it ( 'supports namespaces', function ( t ) {

      var ele = $('.event');
      var count = 0;

      function handler () {
        count++;
      }

      ele.on ( 'foo bar.ns1', handler );
      ele.on ( 'foo.ns1.ns2', handler );
      ele.trigger ( 'foo.ns1.ns2' ).trigger ( 'foo.ns1' ).trigger ( 'foo.ns2' );

      t.is ( count, 3 );

    });

    it ( 'supports event delegation', function ( t ) {

      var ele = $('.event');
      var parent = $('.parent');
      var count = 0;

      function handler () {
        count++;
      };

      parent.on ( 'click', '.event', handler );
      ele.trigger ( 'click' );

      t.is ( count, 1 );

      parent.off ( 'click', handler );
      ele.trigger ( 'click' );

      t.is ( count, 1 );

    });

    it.skip ( 'overwrites event.currentTarget when using event delegation', function ( t ) { //URL: https://github.com/kenwheeler/cash/issues/235

      var ele = $('.event');
      var parent = $('.parent');
      var count = 0;
      var currentTargets = [];

      function handler ( event ) {
        count++;
        currentTargets.push ( event.currentTarget );
      };

      parent.on ( 'click', '.event', handler );
      ele.on ( 'click', handler );
      ele.trigger ( 'click' );

      t.is ( count, 2 );
      // t.deepEqual ( currentTargets, [ele[0], ele[0]] ); //FIXME: We can't overwrite `event.currentTarget`

    });

    it.skip ( 'stops propagation if false is returned when using event delegation', function ( t ) { //URL: https://github.com/kenwheeler/cash/issues/235

      var ele = $('.event');
      var parent = $('.parent');
      var child = $('.child');
      var count = 0;
      var currentTargets = [];

      function handler ( event ) {
        count++;
        currentTargets.push ( event.currentTarget );
        return false;
      }

      parent.on ( 'foo', handler );
      parent.on ( 'foo', handler );
      parent.on ( 'foo', '.event', handler );
      parent.on ( 'foo', '.event', handler );
      parent.on ( 'foo', '.child', handler );
      parent.on ( 'foo', '.child', handler );

      parent.trigger ( 'foo' );

      t.is ( count, 2 );
      // t.deepEqual ( currentTargets.slice ( 0 ), [parent[0], parent[0]] ); //FIXME: We can't overwrite `event.currentTarget`

      ele.trigger ( 'foo' );

      t.is ( count, 4 );
      // t.deepEqual ( currentTargets.slice ( 2 ), [ele[0], ele[0]] ); //FIXME: We can't overwrite `event.currentTarget`

      child.trigger ( 'foo' );

      t.is ( count, 6 );
      // t.deepEqual ( currentTargets.slice ( 4 ), [child[0], child[0]] ); //FIXME: We can't overwrite `event.currentTarget`

    });

  });

  describe ( 'one', function ( it ) {

    it ( 'removes the handler after the first call', function ( t ) {

      var ele = $('.event');
      var count = 0;

      var handler = function () {
        count++;
      };

      ele.one ( 'click', handler );
      ele.trigger ( 'click' ).trigger ( 'click' );

      t.is ( count, 1 );

      ele.one ( 'click', handler ).off ( 'click', handler ).trigger ( 'click' );

      t.is ( count, 1 );

    });

  });

  describe ( 'off', function ( it ) {

    it ( 'removes single event', function ( t ) {

      var ele = $('.event');
      var count = 0;

      function handler () {
        count++;
      }

      ele.on ( 'click', handler );
      ele.trigger ( 'click' );
      ele.off ( 'click' );
      ele.trigger ( 'click' );

      t.is ( count, 1 );

    });

    it ( 'removes multiple events', function ( t ) {

      var ele = $('.event');
      var count = 0;

      function handler () {
        count++;
      }

      ele.on ( 'foo bar baz', handler );
      ele.off ( 'foo bar', handler );
      ele.trigger ( 'foo' ).trigger ( 'bar' ).trigger ( 'baz' );

      t.is ( count, 1 );

    });

    it ( 'removes all events', function ( t ) {

      var ele = $('.event');
      var count = 0;

      function handler () {
        count++;
      }

      ele.on ( 'foo bar', handler );
      ele.off ();
      ele.trigger ( 'foo' ).trigger ( 'bar' );

      t.is ( count, 0 );

    });

    it ( 'supports namespaces', function ( t ) {

      var ele = $('.event');
      var count = 0;

      function handler () {
        count++;
      }

      ele.on ( 'foo.ns1.ns2', handler ).off ( 'foo' ).trigger( 'foo' ).trigger ( 'foo.ns1' ).trigger ( 'foo.ns2' ).trigger ( 'foo.ns3' );

      t.is ( count, 0 );

      ele.on ( 'foo.ns1.ns2', handler ).off ( 'foo.ns1' ).trigger( 'foo' ).trigger ( 'foo.ns1' ).trigger ( 'foo.ns2' ).trigger ( 'foo.ns3' );

      t.is ( count, 0 );

      ele.on ( 'foo.ns1.ns2', handler ).off ( 'foo.ns2' ).trigger( 'foo' ).trigger ( 'foo.ns1' ).trigger ( 'foo.ns2' ).trigger ( 'foo.ns3' );

      t.is ( count, 0 );

      ele.on ( 'foo.ns1.ns2', handler ).off ( 'foo.ns1.ns2' ).trigger( 'foo' ).trigger ( 'foo.ns1' ).trigger ( 'foo.ns2' ).trigger ( 'foo.ns3' );

      t.is ( count, 0 );

      ele.on ( 'foo.ns1.ns2 bar.ns1.ns2 baz.ns1.ns2', handler ).off ( '.ns1' ).trigger ( 'foo' ).trigger ( 'bar' ).trigger ( 'baz' );

      t.is ( count, 0 );

      ele.on ( 'foo.ns1.ns2', handler ).off ( 'foo.ns3' ).trigger ( 'foo' ).trigger ( 'foo.ns1' ).trigger ( 'foo.ns2' ).trigger ( 'foo.ns3' );

      t.is ( count, 3 );

    });

  });

  describe ( '$.fn.trigger', function ( it ) {

    it ( 'triggers single event', function ( t ) {

      var ele = $('.event');
      var count = 0;

      function handler () {
        count++;
      }

      ele.on ( 'click', handler );
      ele.trigger ( 'click' );

      t.is ( count, 1 );

    });

    it ( 'can pass data to the handler', function ( t ) {

      var ele = $('.event');
      var count;
      var eventData;
      var data;

      function handler ( event, d ) {
        count ++;
        eventData = event.data;
        data = d;
      }

      var values = [123, 'string', { obj: true }];

      values.forEach ( function ( value ) {

        count = 0;

        ele.on ( 'custom', handler );
        ele.trigger ( 'custom', value );
        ele.off ( 'custom', handler );

        t.is ( count, 1 );
        t.is ( eventData, value );
        t.is ( data, value );

      });

    });

    it ( 'can pass namespaces to the handler', function ( t ) {

      var ele = $('.event');
      var namespaces = [];

      function handler ( event ) {
        namespaces.push ( event.namespace );
      }

      ele.on ( 'foo.ns1.ns2', handler );
      ele.trigger ( 'foo' ).trigger ( 'foo.ns1' ).trigger ( 'foo.ns2' ).trigger ( 'foo.ns1.ns2' );

      t.deepEqual ( namespaces ['', 'ns1', 'ns2', 'ns1.ns2'] );

    });

    it ( 'supports namespaces', function ( t ) {

      var ele = $('.event');
      var count = 0;

      function handler () {
        count++;
      }

      ele.on ( 'foo.ns1.ns2', handler ).trigger ( 'foo' ).trigger ( 'foo.ns1' ).trigger ( 'foo.ns2' ).trigger ( 'foo.ns3' ).trigger ( 'foo.ns1.ns3' );

      t.is ( count, 3 );

    });

  });

});
