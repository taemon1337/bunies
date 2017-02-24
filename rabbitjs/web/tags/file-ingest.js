<file-ingest>
  <div class="row">
    <div class="col-xs-12">
      <div class="pull-right" style="margin-top:15px;">
        <button onclick={ openDialog } type="button" class="btn btn-primary">
          {opts.text || 'Upload File' }
        </button>
        <input onchange={ fileSelect } class="hidden" type="file" id="file" multiple>
      </div>
    </div>
    <div class="col-xs-12">
      <ul class="list-unstyled">
        <li each={ file in files }>
          <upload-progress-bar file={ file } upload={ upload } socket={ socket }></upload-progress-bar>
        </li>
      </ul>
    </div>
  </div>

  <script>
    var self = this

    self.socket = opts.socket
    self.upload = self.socket.channel('upload')
    self.files = opts.files || []

    self.openDialog = function() {
      $(self.root).find('#file').click()
    }

    self.fileSelect = function(e) {
      for(var i=0; i<e.target.files.length; i++) {
        self.files.push(e.target.files[i])
      }
      self.update()
    }
  </script>
</file-ingest>
