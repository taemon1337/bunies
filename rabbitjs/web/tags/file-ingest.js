<file-ingest>
  <div>
    <button onclick={ openDialog } type="button" class="btn btn-primary">{opts.text || 'Upload File' }</button>
    <input onchange={ fileSelect } class="hidden" type="file" id="file" multiple>
  </div>

  <script>
    var self = this

    self.socket = opts.socket
    self.upload = self.socket.channel('upload')

    self.openDialog = function() {
      $(self.root).find('#file').click()
    }

    self.fileSelect = function(e) {
      for(var i=0; i<e.target.files.length; i++) {
        var file = e.target.files[i]
        self.upload.write({ filename: file.name, size: file.size, content_type: file.type })
      }
      setTimeout(function() {
        for(var i=0;i<e.target.files.length; i++) {
          var file = e.target.files[i]
          FileSubstream(file, self.socket.substream(file.name))
        }
      }, 1000);
    }

  </script>
</file-ingest>
