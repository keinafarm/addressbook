angular.module('myApp',[] )
  .controller( 'addressBook',
  [ '$scope', '$http', function($scope, $http){

      var addressBook = [];
      $scope.records = 0;
      //
      //  顧客情報を読みだす
      //
      $scope.onClickReadPerson = function() {
          $scope.address2 = "onClickReadPerson";
          sendData = JSON.stringify({
            command:"read",
          });
          $http({
            method: 'POST',
            url: '/addressbook',
            data: sendData
          })	// POSTで送信
            // 成功時の処理（受信データを表示）
            .success(function(rcvData, status, headers, config){
              $scope.result = rcvData;
              $scope.pref  = "応答受信";

              addressBook　= rcvData;
              $scope.records = rcvData.length;
              $scope.currentRecord = 0;
              if ($scope.records > 0)
              {
                showAddress();
              }
            })
            // 失敗時の処理（ページにエラーメッセージを反映）
            .error(function(data, status, headers, config){
              $scope.result = '通信失敗！';
            });
      };
      //
      //  表示されている顧客情報を追加する
      //
      $scope.onClickAddPerson = function() {
        if ($scope.addressbook.$invalid)
        {
          $scope.address1 = "データ不正";
        }
        else {
          sendData = JSON.stringify({
            command:"add",
            name_rubi:$scope.name_rubi,
            name_kanji:$scope.name_kanji,
            zipcode:$scope.zipcode,
            address1:$scope.address1,
            address2:$scope.address2,
            telno1:$scope.telno1,
            telno2:$scope.telno2,
          });
          $http({
            method: 'POST',
            url: '/addressbook',
            data: sendData
          })	// POSTで送信
            // 成功時の処理（受信データを表示）
            .success(function(rcvData, status, headers, config){
              $scope.result = rcvData;
              $scope.pref  = "応答受信";
            })
            // 失敗時の処理（ページにエラーメッセージを反映）
            .error(function(data, status, headers, config){
              $scope.result = '通信失敗！';
            });
          $scope.address2 = "onClickAddPerson";
        }
      };
      //
      //  表示されている顧客情報で更新する
      //
      $scope.onClickModifyPerson = function() {
        $scope.address2 = "onClickModifyPerson";
      };
      //
      //  表示されている顧客情報を削除する
      //
      $scope.onClickDeletePerson = function() {
        $scope.address2 = "onClickDeletePerson";
      };
      //
      //  入力内容をクリアする
      //
      $scope.onClickCLearPerson = function() {
        $scope.key = "";
        $scope.name_rubi = "";
        $scope.name_kanji = "";
        $scope.zipcode = "";
        $scope.address1 = "";
        $scope.address2 = "";
        $scope.telno1 = "";
        $scope.telno2 = "";
      };
      /**
       * 郵便番号から住所を得る
       *
       */
      $scope.onClickGetAddress = function() {
        // 全角だったら半角に変換
        zipcode = toHalfWidth($scope.zipcode);
        // 郵便番号の正規表現
        var reg = new RegExp(/^\d{3}-?\d{4}$/);
        // 入力されていない時は変換できない
        if ( zipcode.length === 0 ) {
          $scope.result = "郵便番号が入力されていません";
          return;
        }
        // nnn-mmmmまたはnnnmmmmのパターンだけを郵便番号とする
        else if ( !reg.test(zipcode) ) {
          $scope.result = "郵便番号が不正です";
          return;
        }
        // 入力された郵便番号を整形する
        zipcode = zipcode.replace( "-", "" );

        // 郵便番号を住所に変換してくれるAPIに問い合わせる
        $http.get( 'https://api.zipaddress.net/' ,{params:{zipcode: zipcode}})
        .success( function(data,status,headers,config ){
          code = data.code;
          if (code==200) {
            $scope.result = data.data;
            $scope.pref = data.data.pref;
            $scope.address = data.data.address;
            $scope.city = data.data.city;
            $scope.town = data.data.town;
            $scope.address1 = data.data.fullAddress;
            $scope.address2 = "";
          }
          else {
            $scope.result = "住所不明";
          }
        })
        .error( function(data,status,headers,config ){
          $scope.result = "通信失敗";
        });
      };
      $scope.onClickNext = function() {
        ++$scope.currentRecord;
        showAddress();
      };
      $scope.onClickPrev = function() {
        --$scope.currentRecord;
        showAddress();
      };

      function showAddress(){
        no = $scope.currentRecord;
        if ( addressBook.length <= no )
          no = addressBook.length-1;
        if ( no < 0 )
          no = 0;

        $scope.name_rubi = addressBook[no].name_rubi;
        $scope.name_kanji = addressBook[no].name_kanji;
        $scope.zipcode = addressBook[no].zipcode;
        $scope.address1　= addressBook[no].address1;
        $scope.address2 = addressBook[no].address2;
        $scope.telno1 = addressBook[no].telno1;
        $scope.telno2 = addressBook[no].telno2;
        $scope.currentRecord = no;
      }
    }
  ]
);

/**
 * 全角から半角への変革関数
 * 入力値の英数記号を半角変換して返却
 * [引数]   strVal: 入力値
 * [返却値] String(): 半角変換された文字列
 *  (http://jquery.nj-clucker.com/change-double-byte-to-half-width/)
 */
function toHalfWidth(strVal){
  // 半角変換
  var halfVal = strVal.replace(/[！-～]/g,
    function( tmpStr ) {
      // 文字コードをシフト
      return String.fromCharCode( tmpStr.charCodeAt(0) - 0xFEE0 );
    }
  );

  // 文字コードシフトで対応できない文字の変換
  return halfVal.replace(/”/g, "\"")
    .replace(/’/g, "'")
    .replace(/‘/g, "`")
    .replace(/￥/g, "\\")
    .replace(/　/g, " ")
    .replace(/〜/g, "~");
}
