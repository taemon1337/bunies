<chat>
  <div class="row">
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="btn-toolbar pull-right">
          <div class="btn-group">
            <button type="button" onclick={ send_image } class="btn btn-xs btn-default" title="Embed Image Url">
              <span class="fa fa-photo"></span>
            </button>
            <button type="button" onclick={ send_link } class="btn btn-xs btn-default" title="Embed Link">
              <span class="fa fa-link"></span>
            </button>

          </div>
        </div>
        <p class="panel-title">Chat</p>
      </div>
      <div class="panel-body" style="height:300px;overflow-y:auto;">
        <ul class="list-unstyled">
          <li each={ message in messages }>
            <span style="border-bottom:2px solid #{ hashColor(message.user) };">{ message.user }:</span>
            <span if={ message.image && message.image.startsWith('http') }><img src={ message.image } height="100"></span>
            <span if={ message.link && message.link.startsWith('http') }>
              <a target="_blank" href={ message.link }>
                { message.link.replace(/.*\//,'') }
                <span class="fa fa-link"></span>
              </a>
            </span>
            <span if={ message.content }>{ message.content }</span>
          </li>
        </ul>
      </div>
      <div class="panel-footer" style="margin:5px;padding:0px;">
        <textarea onkeydown={ onEnter } name="message" class="form-control textbox" placeholder="type message..." rows="4"></textarea>
      </div>
    </div>
  </div>

  <style>
    .panel {
      font-size:10px;
    }
    .textbox {
      font-size:10px;
      resize:none;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }
  </style>

  <script>
    var self = this
    self.messages = opts.messages || []
    self.socket = opts.socket.channel('chat')

    self.getUser = function() {
      return "Tim"+Math.random().toString().replace('.','').substring(0,4)
    }

    self.send = function(e) {
      e.preventDefault()
      if(e.target.value === "clear") {
        self.update({ messages: [] })
      } else if(e.target.value) {
        self.socket.send('message', { user: self.getUser(), content: e.target.value })
      }
      e.target.value = ''
    }

    self.onEnter = function(e) {
      if(e.which === 13) {
        if(!e.shiftKey && !e.ctrlKey) {
          self.send(e)
        }
      }
    }

    self.send_cors_image = function() {
      var url = prompt("Enter the Photo Url");
      if(url) {
        getBase64FromImageUrl(url, function(datauri) {
          self.socket.send('image', { user: self.getUser(), image: datauri })
        })
      }
    }

    self.send_image = function() {
      var url = prompt("Enter the Image Url");
      if(url) {
        self.socket.send('image', { user: self.getUser(), image: url })
      }
    }

    self.send_link = function() {
      var url = prompt("Enter the Link Url");
      if(url) {
        self.socket.send('link', { user: self.getUser(), link: url })
      }
    }

    self.socket.on('data', function(msg) {
      self.messages.push(msg)
      self.update()
    })

    self.on('update', function() {
      var bod = $(self.root).find('.panel-body')[0]
      bod.scrollTop = bod.scrollHeight
    })
  </script>
</chat>
