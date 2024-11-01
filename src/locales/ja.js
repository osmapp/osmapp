// identifier should be in the form: foldername.messageid.

import { t } from '../services/intl';
import React from 'react';

export default {
loading: '読み込み中',
error: 'エラー',
close_panel: 'パネルを閉じる',
webgl_error: `おっと。この地図には WebGL テクノロジーが必要です。<br /><br />
互換性のあるデバイスをお持ちの場合は、ブラウザの最新バージョンを使用してみるか、WebGL を有効にしてください。
<ul><li>in <a href="https://otechworld.com/webgl-in-firefox/">Firefox, Librewolf</a>
<li>in <a href="https://www.geeksforgeeks.org/how-to-enable-webgl-on-chrome/">Chrome, Chromium, Brave, Edge</a></ul>`,
darkmode_auto: 'ダークモード：自動',
darkmode_on: 'ダークモード：オン',
darkmode_off: 'ダークモード：オフ',
show_more: '詳細表示',
show_less: '簡易表示',

'user.login_register': 'ログイン/登録',
'user.logout': 'ログアウト',
'user.my_ticks': '私のチェック',
'user.user_settings': '設定',

'my_ticks.title': '私のチェック',
'my_ticks.route_name': '名前',
'my_ticks.route_grade': 'グレード',
'my_ticks.route_style': '種類',
'my_ticks.route_date': '日付',
'my_ticks.no_ticks_paragraph1': 'チェックはまだないようです...',
'my_ticks.no_ticks_paragraph2': '岩山に追加してみてください',

'tick.style_description_not_selected': 'クライミング種類は選択していません。',
'tick.style_description_OS': '事前の知識も練習もなく、初めてルートを登る。',
'tick.style_description_FL': 'ある程度の予備知識またはムーブを使用して、最初の試行でルートを登ること。',
'tick.style_description_RP': '事前に練習した結果、無事にルートを登ること。',
'tick.style_description_PP': '練習後、事前に設置された保護具を使用してルートを登ることに成功すること。',
'tick.style_description_RK': 'フリークライミングとエイドクライミングを組み合わせてルートを登ること。',
'tick.style_description_AF': 'エイドを使わずに完全にフリーでルートを登ること。',
'tick.style_description_TR': 'すでに頂上に固定されているロープを使ってルートを登ること。',
'tick.style_description_FS': '防具やロープを着用せずにルートを登ること。',

'climbing_renderer.climbing_grade': 'クライミンググレード ',

'project.osmapp.description': 'OpenStreetMap のユニバーサル アプリ',
'project.osmapp.serpDescription':
'OpenStreetMap データベースに基づくオープンソースの世界地図。検索、クリック可能なPOI、アプリ内マップ編集などの機能を備えています。',

'climbing.guideinfo.title': '無料のクライミングガイド openclimbing.org',
'climbing.guideinfo.description':
'OpenClimbing.org は、クライミングガイドと地図のためのオープン プラットフォームです。地形図と写真は OpenStreetMap および Wikipedia プロジェクトに保存されるため、誰でも編集できます。',

'project.openclimbing.description': '無料のWikiクライミング地図',
'project.openclimbing.serpDescription': '地形図を備えた Wiki ベースのオープンソース登山地図。OpenStreetMap および Wikipedia プロジェクトに基づいて構築されています。',

'install.button': 'アプリをインストール',
'install.tabs_aria_label': 'プラットフォームを選択',
'install.ios_intro': '<strong>Safari ブラウザ</strong>で osmapp.org を開く',
'install.ios_share': '<strong>共有アイコン</strong>をタップ',
'install.ios_add': '<strong>ホーム画面に追加</strong> をタップ',
'install.android_intro': '<strong>Chrome または Firefox ブラウザ</strong>で osmapp.org を開く',
'install.android_share': '<strong>三点メニュー</strong>をタップ',
'install.android_add': '<strong>アプリをインストール</strong> をタップ',
'install.desktop_intro': '<strong>Chrome</strong>、<strong>FirefoxOS</strong>、または  <strong>Opera</strong> で osmapp.org を開く',
'install.desktop_install': '<strong>インストール ボタン</strong>をクリック',
'install.outro': 'それでおしまい！OsmAPP がホーム画面に表示されるはずです。',
'install.note': '注: このアプリは PWA テクノロジーを使用しており、Google Play や​​ App Store を使用せずに簡単にインストールできます。',

'homepage.how_to_start': 'まず、検索ボックスにクエリを入力する。\nまたは、マップ上の任意の項目をクリックする。',
'homepage.go_to_map_button': '地図へ',
'homepage.examples.eg': '例えば',
'homepage.examples.charles_bridge_statues': 'カレル橋の彫像',
'homepage.screenshot_alt': 'OsmAPPのスクショ',
'homepage.about_osm': `すべての地図データは <a href="https://osm.org">OpenStreetMap</a> からのものです。これは、Wikipedia に似た、数百万人の寄稿者によって作成された地図です。各マップ フィーチャには<em>編集</em>ボタンがあります。`,
'homepage.heading_about_osmapp': 'OsmAPP について',
'homepage.about_osmapp': `このアプリは、編集機能を含め、<i>OpenStreetMap</i> を日常的に使用するための快適なインターフェイスを提供することを目的としています。<br/>現在、さまざまなマップ レイヤー、POI 編集、および基本的な検索エンジンが含まれています。
ナビやお気に入りの場所などの機能が計画されています。`,
'homepage.github_link': `<a href="https://github.com/zbycz/osmapp" target='_blank'>GitHub</a> で新機能を提案できます。`,
'homepage.special_thanks_heading': `提供の感謝`,
'homepage.for_images': '画像🖼',
'homepage.for_osm': '最高の世界地図🌎',
'homepage.maptiler': '素晴らしいベクターマップとこのプロジェクトのサポート❤️ ',
'homepage.vercel': '優れたアプリホスティングプラットフォーム',
'homepage.disclaimer_heading': '免責事項',
'homepage.disclaimer': `OpenStreetMap および OSM は OpenStreetMap Foundation の商標です。このプロジェクトは、<a href="https://osmfoundation.org/" target='_blank'>OpenStreetMap Foundation</a> によって承認または提携されていません。`,
'homepage.disclaimer_maptiler':  `ベクターマップ (「ベーシック」および「アウトドア」) には、ウィキデータ プロジェクトのいくつかの地名が含まれています。詳細は <a href="https://github.com/openstreetmap/openstreetmap-website/pull/4042#issuecomment-1562761674" target='_blank'>こちら</a>にあります。`,

'searchbox.placeholder': 'OpenStreetMapを検索',
'searchbox.category': 'カテゴリ',
'searchbox.overpass_success': '結果件数: __count__',
'searchbox.overpass_error': '結果の取得中にエラーが発生しました。 __message__',
'searchbox.overpass_custom_query': 'カスタムクエリ',

'directions.get_directions': '経路',
'directions.form.starting_point': '出発地',
'directions.form.destination': '目的地',
'directions.edit_destinations': '目的地を編集',
'directions.powered_by': '__link__ による経路',
'directions.result.time': '時間',
'directions.result.distance': '距離',
'directions.result.ascent': '上昇',
'directions.error.too_far': '目的地が道路網から遠すぎます。より近い目的地を選択してください。',

'featurepanel.no_name': '名前なし',
'featurepanel.share_button': '共有',
'featurepanel.favorites_save_button': 'お気に入りに保存',
'featurepanel.favorites_unsave_button': 'お気に入りから削除',
'featurepanel.directions_button': '経路',
'featurepanel.error': 'OpenStreetMap から地物を取得中にエラー __code__',
'featurepanel.error_unknown': 'OpenStreetMap から地物を取得中に不明なエラーが発生しました。',
'featurepanel.error_network': "地物を取得できません。通信環境を確認してください。",
'featurepanel.error_deleted': 'この地物は OpenStreetMap で削除済みとしてマークされています。',
'featurepanel.info_no_tags': 'この地物にはタグがありません。通常、これは親オブジェクトの形状/位置のみを保持することを意味します。',
'featurepanel.history_button': '履歴 »',
'featurepanel.details_heading': '詳細',
'featurepanel.all_tags_heading': 'すべてのタグ',
'featurepanel.edit_button_title': 'OpenStreetMap データベースで編集',
'featurepanel.note_button': '編集を提案',
'featurepanel.edit_button': '詳細を編集',
'featurepanel.add_place_button': '場所を追加',
'featurepanel.undelete_button': '削除取り消し',
'featurepanel.feature_description_nonosm': '地物 __type__',
'featurepanel.feature_description_osm': 'OpenStreetMap データベースの __type__',
'featurepanel.feature_description_point': '地図座標',
'featurepanel.show_tags': 'タグを表示',
'featurepanel.show_objects_around': '近くの地物を表示',
'featurepanel.uncertain_image': 'これは __from__ からの最も近い街路写真です。不正確かもしれません。',
'featurepanel.inline_edit_title': '編集',
'featurepanel.objects_around': '近くの地物',
'featurepanel.more_in_openplaceguide': '__instanceName__ の詳細情報',
'featurepanel.climbing_restriction': 'クライミング制限',
'featurepanel.login': 'ログイン',

'opening_hours.all_day': '24時間',
'opening_hours.open': '営業時間: __todayTime__',
'opening_hours.now_closed_but_today': '現在閉店 - 営業時間 __todayTime__',
'opening_hours.today_closed': '本日は閉店',
'opening_hours.opens_soon': 'まもなく開店します',
'opening_hours.opens_soon_today': 'まもなく開店: __todayTime__',
'opening_hours.closes_soon': 'まもなく閉店します',
'opening_hours.days_su_mo_tu_we_th_fr_sa': '日曜日|月曜日|火曜日|水曜日|木曜日|金曜日|土曜日',
'opening_hours.editor.closed': '閉店',
'opening_hours.editor.create_advanced': '<link>YoHours ツール</link>でより詳細な営業時間を作成できます。',
'opening_hours.editor.cant_edit_here': "この営業時間はここでは編集できません。<link>YoHours ツール</link>を使用してください。",

'map.github_title': 'GitHub リポジトリ',
'map. language_title': '言語を変更',
'map.osm_copyright_tooltip': '(c) OpenStreetMap.org の貢献者<br> – 地球の無料地図データ 👌',
'map.maptiler_copyright_tooltip': '(c) MapTiler.com ❤️ <br> – ベクトルタイル、ホスティング、アウトドアマップ<br>このプロジェクトをサポートしていただき、誠にありがとうございます。 🙂 ',
'map.more_button': 'もっと見る',
'map.more_button_title': 'その他のオプション…',
'map.edit_link': 'このエリアを iD エディターで編集',
'map.about_link': 'このアプリについて',
'map.compass_tooltip': 'ドラッグして 3次元 に入ります。クリックでリセットできます。',

'editdialog.add_heading': 'OpenStreetMap に追加',
'editdialog.undelete_heading': 'OpenStreetMap に再度追加',
'editdialog.edit_heading': '編集:',
'editdialog.suggest_heading': '編集を提案:',
'editdialog.feature_type_select': '種類を選択',
'editdialog.options_heading': 'オプション',
'editdialog.cancel_button': 'キャンセル',
'editdialog.save_button_edit': 'OSMに保存',
'editdialog.save_button_delete': '削除',
'editdialog.save_button_note': '送信',
'editdialog.changes_needed': 'いくつか変更を加えてください。',
'editdialog.osm_session_expired': 'OpenStreetMap セッションの有効期限が切れました。再度ログインしてください。',
'editdialog.loggedInMessage': '<b>__osmUser__</b> としてログインしています。変更はすぐに保存されます。',
'editdialog.logout': 'ログアウト',
'editdialog.anonymousMessage': '<b>匿名</b>のメモがマップに追加されます。OpenStreetMap にログインすると、変更はすぐに反映されます。',
'editdialog.add_major_tag': '追加',
'editdialog.location_checkbox': '新しい場所',
'editdialog.location_placeholder': '例:通りの向こう側にある',
'editdialog.location_editor_to_be_added': 'ここでは位置を編集できません。<a href="__link__">iD エディタ</a>で編集できます。',
'editdialog.place_cancelled': '完全に閉鎖 (削除)',
'editdialog.comment': 'コメント (任意)',
'editdialog.comment_placeholder': 'メモ、情報源へのリンクなど',
'editdialog.info_edit': `編集内容はすぐに OpenStreetMap に保存されます。自分自身または検証済みの情報源からの情報のみを入力してください。著作権で保護されたデータ（Google マップなど）をコピーすることは禁止されています。 <a href="https://wiki.openstreetmap.org/wiki/JA:%E8%91%97%E4%BD%9C%E6%A8%A9">詳細</​​a>`、
'editdialog.info_note':
'あなたの提案は OpenStreetMap のボランティアによってレビューされます。写真へのリンクやソース素材へのリンクなどの追加情報を以下に追加できます。',
'editdialog.tags_editor': 'すべてのプロパティ – タグ',
'editdialog.tags_editor_info': `タグには、マップ上にオブジェクトを表示するために使用されるデータが含まれています。<br><a href="https://wiki.openstreetmap.org/wiki/JA:Map_Features" target="_blank"> を見つけることができます。 OpenStreetMap Wiki</a> のすべてのタグのリファレンス。`,
'editdialog.login_in_progress': `ログイン中...`,
'editdialog.save_raised': '変更を保存できません。',

'editsuccess.close_button': '完了',
'editsuccess.note.heading': 'ご提案ありがとうございます!',
'editsuccess.note.subheading': 'OpenStreetMap ボランティアがレビューします。',
'editsuccess.note.body':
'通常、変更が審査されるまでに数日かかります。この地域で活動するボランティアがいない場合は、時間がかかる可能性があります!',
'editsuccess.note.urlLabel': 'ここで情報を追加したり、更新をフォローしたりできます:',
'editsuccess.note.textLabel': 'メモを入力',
'editsuccess.edit.heading': '編集していただきありがとうございます!',
'editsuccess.edit.subheading': 'あなたの変更は世界中の地図に表示され始めています。',
'editsuccess.edit.body': `変更はすぐに OSM データベースに反映され、数分以内に「OSM Carto」レイヤーに表示されます。
OsmAPP マップおよびその他のアプリケーションは、月に 1 回程度更新されます。
<br/><br/>これが間違いである場合は、手動で値を元に戻して再度保存できます。`,
'editsuccess.edit.urlLabel': `変更内容:`,
'editsuccess.edit.textLabel': 'コメント',
'editdialog.preset_select.label': '種類:',
'editdialog.preset_select.placeholder': '種類を選択',
'editdialog.preset_select.search_placeholder': '検索する文字を入力してください...',
'editdialog.preset_select.edit_button': '編集',

'tags.name': '名前',
'tags.description': '説明',
'tags.website': 'ウェブサイト',
'tags.phone': '電話',
'tags.opening_hours': '営業時間',

'coordinates.geo_uri': 'GeoURI (携帯地図アプリ)',
'coordinates.copy_value': '__value__ をコピー',

'layerswitcher.button': 'レイヤー',
'layerswitcher.heading': 'マップレイヤー',
'layerswitcher.intro': 'OpenStreetMap が原本データを提供しているため、誰でもマップのさまざまなバリエーションを作成できます。',
'layerswitcher.add_layer_button': 'カスタムレイヤーを追加',
'layerswitcher.overlays': 'オーバーレイ',
'layerswitcher.not_all_work': '一部のレイヤーは OsmAPP では動作しない可能性があることに注意してください。',
'layerswitcher.license': 'ライセンス',
'layerswitcher.privacy_policy': 'プライバシー ポリシー',
'layerswitcher.category': 'カテゴリ',
'layerswitcher.category_photo': '航空写真',
'layerswitcher.category_osmbasedmap': '通常のレイヤー',
'layerswitcher.compatibility_license': 'OpenStreetMap の編集に互換性のあるライセンス',
'layerswitcher.layers_in_area': 'このエリアのレイヤーをフィルターします',
'layerswitcher.explaination': '{z}、{x}、{y} トークンまたは {bbox-epsg-3857} を挿入してください',

'layers.basic': 'ベーシック',
'layers.makina_africa': 'OpenPlaceGuide アフリカ',
'layers.outdoor': 'アウトドア',
'layers.mtb': 'MTB',
'layers.snow': '雪',
'layers.carto': 'OSM Carto',
'layers.maptilerSat': 'Maptiler 衛星 (z<14)',
'layers.bingSat': 'Bing 衛星',
'layers.bike': '自転車',
'layers.climbing': 'クライミング',

'climbingpanel.create_climbing_route': 'スキーマに新しいルートを描画',
'climbingpanel.edit_climbing_route': 'スキーマ内のルートを編集',
'climbingpanel.finish_climbing_route': 'ルートを完了',
'climbingpanel.cancel_climbing_route': 'キャンセル',
'climbingpanel.delete_climbing_route': 'スキーマ内のルート __route__ を削除',
'climbingpanel.create_first_node': 'ルートの先頭をクリックして、ルートの方向に進んでください',
'climbingpanel.create_next_node': 'ルートの方向に従い、完了したら「完了」をクリックしてください',

'publictransport.tourism': '観光列車',
'publictransport.night': '夜行列車',
'publictransport.car_shuttle': '自動車シャトル',
'publictransport.car': 'カートレイン',
'publictransport.commuter': '通勤電車',
'publictransport.regional': '地域鉄道',
'publictransport.long_distance': '長距離列車',
'publictransport.high_speed': '高速鉄道',
'publictransport.bus': 'バス',
'publictransport.subway': '地下鉄',
'publictransport.unknown': '不明な種類',

'publictransport.show_this_category': 'このカテゴリを表示',
'publictransport.hide_this_category': 'このカテゴリを非表示にする',
'publictransport.only_this_category': 'このカテゴリのみを表示',

'publictransport.route': 'ルート',
'publictransport.hidden_stops': 'あと __amount__ の停留所',
'publictransport.visible_stops': '__amount__ の停留所を非表示にする',

'climbingpanel.draw_route': 'ルートを描画',

'climbingpanel.show_route_detail': 'ルートの詳細を表示',
'climbingpanel.add_tick': 'チェックを追加',
'climbingpanel.edit_route': 'ルートを編集',

'runway.information': '滑走路情報',
'runway.runway': '滑走路',
'runway.size': '長さ (m) - 幅 (m)',
'runway.surface': '表面',

'climbingareas.link': 'すべてのクライミングエリアのリスト',
'climbingareas.title': 'クライミングエリア',
'climbingareas.area': 'エリア',
'climbingareas.num_of_crags': '岩山の数',

'member_features.subitems': 'サブアイテム',
'member_features.climbing': 'クライミングルート',
'member_features.routes': 'ルート',
};
