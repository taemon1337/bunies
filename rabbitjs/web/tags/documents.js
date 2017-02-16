<documents>
  <div class="row">
    <div class="col-xs-12">
      <div class="pull-right" style="margin-top:15px;">
        <file-ingest text="Upload Document" socket={ opts.socket } store={ opts.store }></file-ingest>
      </div>
      <h1>Documents</h1>

      <div data-is="riot-table" headers={ headers } records={ records } fetch={ fetch } record_buttons={ record_buttons }></div>
    </div>
  </div>

  <script>
    var self = this
    self.store = opts.store
    self.records = opts.records || []
    self.collection = opts.collection || 'documents'
    self.query = opts.query || {}

    self.fetch = function(cb) {
      self.store.findAll(self.collection, self.query)
      cb()
    }

    self.headers = opts.headers || {
      _id: {},
      filename: {},
      size: { template: "{ humanFileSize(size) }" },
      content_type: {}
    }

    self.record_buttons = opts.record_buttons || [
      { text: "Download", fa: "download", href: function(record) { return record.attached_file ? "."+record.attached_file.file : "#" }},
      { text: "Delete", fa: "trash", event: "document:delete" }
    ]

    self.on('document:delete', function(record) {
      var a = confirm("Are you sure you want to delete "+record.filename+"?")
      if(a) {
        self.store.destroy(self.collection, record._id)
      }
    })

    self.store.on(self.collection,'DS.afterInject', function() {
      var records = self.store.filter(self.collection,self.query)
      console.log("DS.change", records)
      self.update({ records: records })
      self.tags['riot-table'].update({ records: records })
    })
  </script>
</documents>
