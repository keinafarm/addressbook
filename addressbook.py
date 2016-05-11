# coding:utf-8
import os
import logging
import json
import webapp2
from google.appengine.api import users
from google.appengine.ext import ndb

#from google.appengine.ext import webapp
#from google.appengine.ext.webapp import template
#from google.appengine.ext.webapp.util import run_wsgi_app
import webapp2_extras.json
#----------
#    データベースデータのクラス定義
#----------
class addressBook( ndb.Model):
    name_rubi = ndb.StringProperty()
    name_kanji = ndb.StringProperty()
    zipcode = ndb.StringProperty(indexed=False)
    address1 = ndb.StringProperty(indexed=False)
    address2 = ndb.StringProperty(indexed=False)
    telno1 = ndb.StringProperty(indexed=False)
    telno2 = ndb.StringProperty(indexed=False)

class AddressBook(webapp2.RequestHandler):
    def post(self):
        logging.info('AddressBook.post')
        logging.info( self.request.POST)
        logging.info( self.request.params )
        logging.info( self.request.get('postvalue'))
        logging.info( self.request.body)
        receivedata = self.request.params
        content_body_dict = webapp2_extras.json.decode(self.request.body)
        content_body_dict['id'] = 215

        obj = addressBook(
        name_rubi = content_body_dict['name_rubi'],
        name_kanji= content_body_dict['name_kanji'],
        zipcode   = content_body_dict['zipcode'],
        address1  = content_body_dict['address1'],
        address2  = content_body_dict['address2'],
        telno1    = content_body_dict['telno1'],
        telno2    = content_body_dict['telno2'],
        )
        key = obj.put()
        keys = key.pairs()
        resp = {'key':keys}
        response = webapp2_extras.json.encode(resp)
        self.response.out.write(response)


# app  = webapp.WSGIApplication([('/addressbook', AddressBook)], debug=True)

def main():
    run_wsgi_app(app)

if __name__ == "__main__":
    main()
