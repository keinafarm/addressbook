# coding:utf-8
import json
from functools import wraps
from flask import Flask, jsonify, request, url_for, abort, Response
from google.appengine.api import users
from google.appengine.ext import ndb
import sys
app = Flask(__name__)

@app.route('/')
def rootPage():
    """
    Root Page
    1) Read index.html
    2) output this
    """
    print "rootPage"         # Debug用:Hostコンソール出力
    clientSource = open('templates/index.html').read()
    return clientSource

#
#-------------------------------------------------------
#    お客様情報の管理
#-------------------------------------------------------
#
@app.route('/addressbook', methods=(['post']) )
def addressbook():
    """
    """
    content_body_dict = json.loads(request.data)    # 受信メッセージをJSONで解釈してDICTオブジェクトに
    print "Key List(received)="
    print request.form.keys()               # Debug用 受信messageのキー一覧を出力
    print "Dict Obj(parsed)="
    print content_body_dict.keys()          # JSONを解釈したオブジェクトのキー一覧を出力

    response = jsonify(content_body_dict)   # JSON化
    response.status_code = 200
    return response
#
#-------------------------------------------------------
#    GET/POSTのテスト
#-------------------------------------------------------
#








@app.route('/getTest', methods=(['get'] ))
def getTest():
    """
    /getTest Page
    1) Echo Back GET message
    """
    print "GetTest"       # Debug用:Hostコンソール出力
    data = request.args.get('name')
    return data

@app.route('/postTest', methods=(['post']) )
def postTest():
    """
    /postTest Page
    1) Get POST message as JSON
    2) add id<-215
    3) Echo Back those message as JSON
    """
    content_body_dict = json.loads(request.data)    # 受信メッセージをJSONで解釈してDICTオブジェクトに
    print "Key List(received)="
    print request.form.keys()               # Debug用 受信messageのキー一覧を出力
    print "Dict Obj(parsed)="
    print content_body_dict.keys()          # JSONを解釈したオブジェクトのキー一覧を出力
    content_body_dict['id'] = 215           # IDを追加(試しにデータを加工する）
    response = jsonify(content_body_dict)   # JSON化
    response.status_code = 201
    return response
#
#-------------------------------------------------------
#    NDBのテスト
#-------------------------------------------------------
#
#    http://appengine.keicode.com/gae/datastore-ndb.php
#    のサンプルからCopy
#
@app.route('/databaseTest')
def databaseTest():
    """
    /databaseTest Page
    """
    print "databaseTest"         # Debug用:Hostコンソール出力
    clientSource = open('templates/databaseTest.html').read()
    return clientSource

#-----------
#    POSTを受信した時の処置
#        受信データから登録する要素を取り出しDBに登録する
#-----------
@app.route('/databaseTestPost', methods=(['post']))
def databaseTestPost():
    print "databaseTestPost"         # Debug用:Hostコンソール出力
    content_body_dict = json.loads(request.data)    # 受信メッセージをJSONで解釈してDICTオブジェクトに
    print "Key List(received)="
    print request.form.keys()               # Debug用 受信messageのキー一覧を出力
    print "Dict Obj(parsed)="
    print content_body_dict.keys()          # JSONを解釈したオブジェクトのキー一覧を出力
    storeDB(content_body_dict["first_name"], content_body_dict["last_name"],  content_body_dict["age"] )

    data = restoreDB();
    response = jsonify(json.dumps(data))   # JSON化
    response.status_code = 201
    return response


#-----------
#    GETを受信した時の処置
#        DBからデータを取り出し送信する
#-----------
@app.route('/databaseTestGet', methods=(['Get']))
def databaseTestGet():
    print "databaseTestGet"         # Debug用:Hostコンソール出力
    data = restoreDB();
    response = json.dumps(data)     # JSON化
    return response

#----------
#    データベースデータのクラス定義
#----------
class Person(ndb.Model):
    first_name = ndb.StringProperty()
    last_name = ndb.StringProperty()
    age = ndb.IntegerProperty()

#----------
#    データ保存
#----------
#
def storeDB( a_first_name, a_last_name, a_age ):
    print "storeDB"
    p = Person(first_name=a_first_name, last_name=a_last_name, age=int(a_age) )
    p_key = p.put()
    print "-------------------------------------------------"
    # Storeしたデータはput()の戻り値で得られる
    # StoreするデータにはKindとIDが付加されている
    # こんな感じ
    # Person(key=Key('Person', 5066549580791808), age=553, first_name=u'akira2', last_name=u'\u3088\u3057\u30602')
    #
    # kindとidはそれぞれメソッドで読み出す。
    #  (つまりkind(),id())
    # そのほかの値は、keyを含めてプロパティで読み出す
    #  (つまり.key, .age)
    # エンティティは親子関係に出来て、親が何かはparent()で読み出せる。（今回はnone)
    print "key="
    print p_key
    print "key.kind="
    print p_key.kind()
    print "key.id="
    print p_key.id()
    print "key.parent="
    print p_key.parent()
    print "-------------------------------------------------"

#----------
#    データ読み出し
#----------
#
def restoreDB():
    print "restoreDB"
    # .query()で検索条件を指定する。今回は全部
    query = Person.query()
    #  .fetch()で読み出す引数には読み出し件数を指定できるけど、今回は全部
    people = query.fetch()
    print  people
    print  "person="
    #
    #    JSONにするには、DICT型でなければならない
    #    Person型にはKeyObjectが含まれているので、to_dict()を使ってDICT型化する必要がある
    #    ちなみにDict型になったデータには、Keyオブジェクトは含まれていない。
    #
    resolut = [p.to_dict() for p in people]
    print  resolut

    return resolut

if __name__ == '__main__':
    app.run()
