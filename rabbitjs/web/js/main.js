riot.compile(function() {
  var currentTag = null;
  var currentNav = null;
  var socket = window.socket = Primus.connect(window.location.href, {});
  var store = window.store = new Store(socket);

  function mountNavbar(opts) {
    currentNav && currentNav.unmount(true)
    currentNav = riot.mount('#navbar', 'navbar', opts)[0]
  }

  function mount(tag, opts) {
//    mountNavbar({ tabs: "" })
    currentTag && currentTag.unmount(true)
    opts = opts || {}
    opts.socket = opts.socket || socket
    opts.store = opts.store || store
    currentTag = riot.mount('#main', tag, opts)[0]
  }

  /*
   * /users         ->  mount('users', { users: [] })
   * /users/1       ->  mount('users-show', { user: user })
   * /users/1/edit  ->  mount('users-edit', { user: user })
   * /users/new     ->  mount('users-new', { user: {} })
   */
  function resourceHandler(collection, id, action) {
    var singular = collection.slice(0,-1);
    var opts = {};
    var tag = id ? [collection,action || 'show'].join('-') : collection;

    app.fetch(collection, id, action, function(resp) {
      opts[id ? singular : collection] = resp;
      mount(tag, opts);
    })
  }

  var routes = {
    home: function(collection, id, action) {
      mount('home')
    }
  };

  function handler(collection, id, action) {
    collection = collection || 'home';
    var fn = routes[collection]
    fn ? fn(collection, id, action) : console.error("No route found: ", collection, id, action)
  }

  riot.mount('*')
  route(handler)
  route.start(true);
});
