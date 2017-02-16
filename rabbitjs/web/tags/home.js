<home>
  <div class="row">
    <div class="col-xs-3">
    </div>
    <div class="col-xs-6">
      <documents store={ opts.store } socket={ opts.socket }></documents>
    </div>
    <div class="col-xs-3">
      <chat socket={ opts.socket } store={ opts.store }></chat>
    </div>
  </div>

  <script>
    var self = this
    self.socket = opts.socket
  </script>
</home>
