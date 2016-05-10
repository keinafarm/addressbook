# coding:utf-8
import os
import logging
import addressbook
import webapp2
from google.appengine.ext.webapp import template
#from google.appengine.ext import webapp
#from google.appengine.ext.webapp import template
#from google.appengine.ext.webapp.util import run_wsgi_app

class MyPage(webapp2.RequestHandler):
    def get(self):
        logging.info('MyPage.get')

        template_values = {}
        path = os.path.join(os.path.dirname(__file__), 'templates/index.html')
        self.response.out.write(template.render(path, template_values))

app  = webapp2.WSGIApplication([('/', MyPage),('/addressbook', addressbook.AddressBook)], debug=True)

#def main():
#    run_wsgi_app(app )

#if __name__ == "__main__":
#    main()
