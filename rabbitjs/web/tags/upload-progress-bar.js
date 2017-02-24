<upload-progress-bar>
  <div class="progress">
    <div class="progress-bar progress-bar-{ status } progress-bar-striped" style="width:{ progress }%;">
      { progress }% - { message }
    </div>
    <span onclick={ start } class="fa fa-play"></span>
  </div>

  <script>
    var self = this

    self.socket = opts.socket
    self.upload = opts.upload
    self.file = opts.file
    self.status = opts.status || "info active"
    self.message = opts.message || self.file.name
    self.progress = opts.progress || 0

    self.substream = self.socket.substream(self.file.name)
    self.upload.send('new', { name: self.file.name, size: self.file.size, content_type: self.file.type })

    self.upload.on(self.file.name+":progress", function(progress) {
      self.update({ progress: progress })
    })


    self.substream.on('end', function(a) {
      self.update({ status: "success" })
      setTimeout(function() {
        self.unmount(true)
      }, 4000)
    })

    self.substream.on('error', function(err) {
      self.update({ status: "error", message: err })
    })

    self.start = function() {
      FileSubstream(self.file, self.substream)
    }

    self.on('mount', function() {
//      self.start()
    })
  </script>
</upload-progress-bar>
