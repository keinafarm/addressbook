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
              showAddress();
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
          // 郵便番号の-はとる
          zipcode = toHalfWidth($scope.zipcode);
          zipcode = zipcode.replace( "-", "" );
          name_rubi = zen2han($scope.name_rubi, true, true, true, true, true, true);
          sendData = JSON.stringify({
            command:"add",
            name_rubi:name_rubi,
            name_kanji:$scope.name_kanji,
            zipcode:zipcode,
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
              addressBook.push(rcvData);
              $scope.currentRecord = addressBook.length-1;
              showAddress();
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
      $scope.onClickClearPerson = function() {
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

      /**
      *
      * 住所録情報を表示する
      *
      */
      function showAddress(){
        $scope.records = addressBook.length;
        no = $scope.currentRecord;
        if ( addressBook.length <= no )
          no = addressBook.length-1;
        if ( no < 0 )
          no = 0;
        if ($scope.records === 0 ) {
          $scope.name_rubi = "";
          $scope.name_kanji = "";
          $scope.zipcode = "";
          $scope.address1　= "";
          $scope.address2 = "";
          $scope.telno1 = "";
          $scope.telno2 = "";
        }
        else {
          $scope.name_rubi = addressBook[no].name_rubi;
          $scope.name_kanji = addressBook[no].name_kanji;
          // 郵便番号は###-####の形に整形する
          zipcode = addressBook[no].zipcode;
          $scope.zipcode = zipcode.substring(0,3) + "-" + zipcode.substring(3,7);
          $scope.address1　= addressBook[no].address1;
          $scope.address2 = addressBook[no].address2;
          $scope.telno1 = addressBook[no].telno1;
          $scope.telno2 = addressBook[no].telno2;
        }
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
/**
 * 全角から半角に置き換え
 *
*/
function zen2han(str) {
  convertTable = {
  'ぁ':'ｧ',
  'あ':'ｱ',
  'ぃ':'ｨ',
  'い':'ｲ',
  'ぅ':'ｩ',
  'う':'ｳ',
  'ぇ':'ｪ',
  'え':'ｴ',
  'ぉ':'ｫ',
  'お':'ｵ',
  'か':'ｶ',
  'が':'ｶﾞ',
  'き':'ｷ',
  'ぎ':'ｷﾞ',
  'く':'ｸ',
  'ぐ':'ｸﾞ',
  'け':'ｹ',
  'げ':'ｹﾞ',
  'こ':'ｺ',
  'ご':'ｺﾞ',
  'さ':'ｻ',
  'ざ':'ｻﾞ',
  'し':'ｼ',
  'じ':'ｼﾞ',
  'す':'ｽ',
  'ず':'ｽﾞ',
  'せ':'ｾ',
  'ぜ':'ｾﾞ',
  'そ':'ｿ',
  'ぞ':'ｿﾞ',
  'た':'ﾀ',
  'だ':'ﾀﾞ',
  'ち':'ﾁ',
  'ぢ':'ﾁﾞ',
  'っ':'ｯ',
  'つ':'ﾂ',
  'づ':'ﾂﾞ',
  'て':'ﾃ',
  'で':'ﾃﾞ',
  'と':'ﾄ',
  'ど':'ﾄﾞ',
  'な':'ﾅ',
  'に':'ﾆ',
  'ぬ':'ﾇ',
  'ね':'ﾈ',
  'の':'ﾉ',
  'は':'ﾊ',
  'ば':'ﾊﾞ',
  'ぱ':'ﾊﾟ',
  'ひ':'ﾋ',
  'び':'ﾋﾞ',
  'ぴ':'ﾋﾟ',
  'ふ':'ﾌ',
  'ぶ':'ﾌﾞ',
  'ぷ':'ﾌﾟ',
  'へ':'ﾍ',
  'べ':'ﾍﾞ',
  'ぺ':'ﾍﾟ',
  'ほ':'ﾎ',
  'ぼ':'ﾎﾞ',
  'ぽ':'ﾎﾟ',
  'ま':'ﾏ',
  'み':'ﾐ',
  'む':'ﾑ',
  'め':'ﾒ',
  'も':'ﾓ',
  'ゃ':'ｬ',
  'や':'ﾔ',
  'ゅ':'ｭ',
  'ゆ':'ﾕ',
  'ょ':'ｮ',
  'よ':'ﾖ',
  'ら':'ﾗ',
  'り':'ﾘ',
  'る':'ﾙ',
  'れ':'ﾚ',
  'ろ':'ﾛ',
  'ゎ':'ﾜ',
  'わ':'ﾜ',
  'ゐ':'ｲ',
  'ゑ':'ｴ',
  'を':'ｦ',
  'ん':'ﾝ',
  'ァ':'ｧ',
  'ア':'ｱ',
  'ィ':'ｨ',
  'イ':'ｲ',
  'ゥ':'ｩ',
  'ウ':'ｳ',
  'ェ':'ｪ',
  'エ':'ｴ',
  'ォ':'ｫ',
  'オ':'ｵ',
  'カ':'ｶ',
  'ガ':'ｶﾞ',
  'キ':'ｷ',
  'ギ':'ｷﾞ',
  'ク':'ｸ',
  'グ':'ｸﾞ',
  'ケ':'ｹ',
  'ゲ':'ｹﾞ',
  'コ':'ｺ',
  'ゴ':'ｺﾞ',
  'サ':'ｻ',
  'ザ':'ｻﾞ',
  'シ':'ｼ',
  'ジ':'ｼﾞ',
  'ス':'ｽ',
  'ズ':'ｽﾞ',
  'セ':'ｾ',
  'ゼ':'ｾﾞ',
  'ソ':'ｿ',
  'ゾ':'ｿﾞ',
  'タ':'ﾀ',
  'ダ':'ﾀﾞ',
  'チ':'ﾁ',
  'ヂ':'ﾁﾞ',
  'ッ':'ｯ',
  'ツ':'ﾂ',
  'ヅ':'ﾂﾞ',
  'テ':'ﾃ',
  'デ':'ﾃﾞ',
  'ト':'ﾄ',
  'ド':'ﾄﾞ',
  'ナ':'ﾅ',
  'ニ':'ﾆ',
  'ヌ':'ﾇ',
  'ネ':'ﾈ',
  'ノ':'ﾉ',
  'ハ':'ﾊ',
  'バ':'ﾊﾞ',
  'パ':'ﾊﾟ',
  'ヒ':'ﾋ',
  'ビ':'ﾋﾞ',
  'ピ':'ﾋﾟ',
  'フ':'ﾌ',
  'ブ':'ﾌﾞ',
  'プ':'ﾌﾟ',
  'ヘ':'ﾍ',
  'ベ':'ﾍﾞ',
  'ペ':'ﾍﾟ',
  'ホ':'ﾎ',
  'ボ':'ﾎﾞ',
  'ポ':'ﾎﾟ',
  'マ':'ﾏ',
  'ミ':'ﾐ',
  'ム':'ﾑ',
  'メ':'ﾒ',
  'モ':'ﾓ',
  'ャ':'ｬ',
  'ヤ':'ﾔ',
  'ュ':'ｭ',
  'ユ':'ﾕ',
  'ョ':'ｮ',
  'ヨ':'ﾖ',
  'ラ':'ﾗ',
  'リ':'ﾘ',
  'ル':'ﾙ',
  'レ':'ﾚ',
  'ロ':'ﾛ',
  'ヮ':'ﾜ',
  'ワ':'ﾜ',
  'ヰ':'ｲ',
  'ヱ':'ｴ',
  'ヲ':'ｦ',
  'ン':'ﾝ',
  'ヴ':'ｳﾞ',
  'ヵ':'ｶ',
  'ヶ':'ｹ',
  };
  var reg = RegExp('[ぁ-ヶ]g');
  str = str.replace(/[ぁ-ヶ]/g, function (match) {
                return convertTable[match];
            });
  return toHalfWidth(str);
}
