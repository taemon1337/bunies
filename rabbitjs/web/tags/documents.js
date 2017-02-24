<documents>
  <div class="row">
    <file-ingest text="Upload Document" socket={ opts.socket } store={ opts.store }></file-ingest>
    <div data-is="riot-table" title="Documents" headers={ headers } fetch={ fetch } record_buttons={ record_buttons }></div>
  </div>

  <script>
    var self = this
    self.store = opts.store
    self.collection = opts.collection || 'documents'
    self.query = opts.query || {}

    self.fetch = function(cb) {
      self.store.findAll(self.collection, self.query)
      cb(self.store.getAll(self.collection))
    }

    self.headers = opts.headers || {
      name: { template: "{ hashColorLine(name) }" },
      size: { template: "{ humanFileSize(size) }" },
      content_type: {},
      status: {},
      download: { text: " ", template: "<a href='./api/raw/{ file }' download={ name } target='_blank'><span class='fa fa-download'></span></a>" }
    }

    self.record_buttons = opts.record_buttons || [
      { text: "Delete", fa: "trash", event: "document:delete" }
    ]

    self.on('document:delete', function(record) {
      var a = confirm("Are you sure you want to delete "+record.filename+"?")
      if(a) {
        self.store.destroy(self.collection, record._id)
      }
    })

    self.store.on(self.collection,'DS.afterInject', function(def, record) {
      self.tags["riot-table"].update({ records: self.store.getAll(self.collection) })
    })

    self.store.on(self.collection,'DS.afterEject', function(def, record) {
      self.tags["riot-table"].update({ records: self.store.getAll(self.collection) })
    })

    self.store.on(self.collection,'DS.findAll', function(records) {
      self.tags["riot-table"].update({ records: records })
    })
  </script>
</documents>
