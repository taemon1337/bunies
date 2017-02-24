"use strict";

(function() {
  var self = this;
  var _original = self.AttachedFile;

  var AttachedFile = function(store) {
    return store.defineResource({
      name: "attached_files",
      idAttribute: "_id",
      relations: {
        belongsTo: {
          document: {
            localField: "document",
            foreignKey: "attached_file"
          }
        }
      }
    })
  }

  AttachedFile.prototype.noConflict = function() {
    self.AttachedFile = _original
    return AttachedFile
  }

  if(typeof exports !== 'undefined') {
    if(typeof module !== 'undefined' && module.exports) {
      exports = module.exports = AttachedFile
    }
    exports.AttachedFile = AttachedFile
  } else {
    self.AttachedFile = AttachedFile
  }
}).call(this);
