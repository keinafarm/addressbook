# coding:utf-8
import os
import logging
import json
import webapp2
#from google.appengine.ext import webapp
#from google.appengine.ext.webapp import template
#from google.appengine.ext.webapp.util import run_wsgi_app
import webapp2_extras.json

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
        response = webapp2_extras.json.encode(content_body_dict)
        self.response.out.write(response)


# app  = webapp.WSGIApplication([('/addressbook', AddressBook)], debug=True)

def main():
    run_wsgi_app(app)

if __name__ == "__main__":
    main()
