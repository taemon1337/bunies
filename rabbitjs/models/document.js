"use strict";

(function() {
  var self = this;
  var _original = self.Document;

  var Document = function(store) {
    return store.defineResource({
      name: "documents",
      idAttribute: "_id",
      relations: {
        hasOne: {
          attached_file: {
            localField: "attached_file",
            foreignKey: "_id"
          }
        }
      }
    })
  }

  Document.prototype.noConflict = function() {
    self.Document = _original
    return Document
  }

  if(typeof exports !== 'undefined') {
    if(typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Document
    }
    exports.Document = Document
  } else {
    self.Document = Document
  }
}).call(this);
