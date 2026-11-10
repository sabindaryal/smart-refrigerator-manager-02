const messages = {
  en: {
    pageTitle: 'Smart Refrigerator', loginTitle: 'Welcome back', loginSubtitle: 'Your kitchen, thoughtfully organised.',
    registerTitle: 'Create your account', registerSubtitle: 'A calmer way to keep track of what you have.',
    recoverTitle: 'Reset your password', recoverIntro:'Enter the email address linked to your account. We will send a code if it is registered.', metricSummary:'Inventory summary', authEyebrow: 'SMART REFRIGERATOR', username: 'Username', password: 'Password',
    usernamePlaceholder: 'Enter your username', email: 'Email address', emailPlaceholder: 'you@example.com',
    passwordPlaceholder: 'Enter your password', newPasswordPlaceholder: 'At least 8 characters', otpPlaceholder: '6 digit code',
    passwordHelp: 'Use at least 8 characters.', loginButton: 'Sign in', forgotLink: 'Forgot password?', noAccount: 'New here?',
    registerLink: 'Create account', createAccount: 'Create account', haveAccount: 'Already have an account?', backLogin: 'Back to sign in',
    loginError: 'Username or password is incorrect.', signupSuccess: 'Account created. Please sign in.', resetSuccess: 'Password updated. Please sign in.',
    otpSent: 'If the account exists, a verification code has been emailed. Enter it within 10 minutes.', sendOtp: 'Send verification code',
    otpCode: 'Verification code', newPassword: 'New password', resetButton: 'Update password',
    brandName: 'Fridge', brandTagline: 'A little more clarity in your kitchen.', greeting: 'Your kitchen, at a glance',
    dashboardSubtitle: 'Know what is fresh, what to use next, and what to make.', profile: 'Profile', logout: 'Sign out',
    profileTitle: 'Profile settings', displayName: 'Display name', preferredLanguage: 'Language', saveProfile: 'Save changes',
    emailReadOnly: 'Email address', foodCount: 'items in your fridge', totalItems: 'Items tracked', expiringCount: 'Expiring soon',
    wasteCount: 'Items discarded', search: 'Search food or category', restock: 'Restock', outOfStock: 'Out of stock',
    expiring: 'Expiring soon', expired: 'Expired', useWithin: 'Use within', days: 'days', daysLeft: 'days left',
    addFood: 'Add to your fridge', foodName: 'Food name', foodNamePlaceholder: 'e.g. Avocado', quantity: 'Quantity',
    expiryDate: 'Best before', category: 'Category', vegetables: 'Vegetables', meatFish: 'Meat & fish', condiments: 'Condiments',
    dairy: 'Dairy', breadRice: 'Bread & rice', fruit: 'Fruit', other: 'Other', add: 'Add item', inventory: 'Your inventory',
    useItUp: 'PERSONALISED IDEAS', menuIdeas: 'Made from what you have', aiLabel: 'AI MENU IDEAS',
    suggestionNote: 'Ideas are matched to ingredients already in your fridge.', trackWaste: 'LESS WASTE', wasteHistory: 'Waste history',
    refresh: 'Refresh', emptyInventory: 'Your fridge is ready for its first item.', expiry: 'Best before', newExpiry: 'New best before date',
    update: 'Save date', markWaste: 'Record waste', remove: 'Remove', validFood: 'Enter a food name, quantity, and date.',
    saveError: 'Could not save your changes.', networkError: 'A network error occurred.', quantityError: 'Quantity cannot be negative.',
    removeConfirm: 'Remove this item without recording it as waste?', dateRequired: 'Choose a date first.',
    wasteQuantity: 'How many units should be recorded as wasted?', wasteReason: 'Reason for waste (expired, spoiled, other):',
    expiredReason: 'Expired', noWaste: 'No waste recorded yet.', uses: 'Uses', minutes: 'min', noSuggestions: 'Add a few items to get personalised ideas.',
    profileSaved: 'Profile saved.', logoutConfirm: 'Sign out of your account?',
    'Vegetable fried rice': 'Vegetable fried rice', 'A quick way to use vegetables and cooked rice.': 'A quick way to use vegetables and cooked rice.',
    'Creamy tomato pasta': 'Creamy tomato pasta', 'Pasta with a simple tomato and dairy sauce.': 'Pasta with a simple tomato and dairy sauce.',
    'Chicken and vegetable stir-fry': 'Chicken and vegetable stir-fry', 'A flexible stir-fry using fresh produce.': 'A flexible stir-fry using fresh produce.',
    Omelette: 'Omelette', 'A fast meal that works with leftover vegetables.': 'A fast meal that works with leftover vegetables.',
    'Fruit and yoghurt bowl': 'Fruit and yoghurt bowl', 'A no-cook option for ripe fruit.': 'A no-cook option for ripe fruit.',
    'Tuna rice bowl': 'Tuna rice bowl', 'A simple pantry meal with fresh toppings.': 'A simple pantry meal with fresh toppings.',
    close:'Close',
    'Username must be 3 to 40 characters.':'Username must be 3 to 40 characters.', 'Enter a valid email address.':'Enter a valid email address.',
    'Password must contain at least 8 characters.':'Password must contain at least 8 characters.', 'That username is already in use.':'That username is already in use.',
    'That email address is already registered.':'That email address is already registered.', 'Invalid or expired reset code.':'Invalid or expired reset code.',
    'Display name is required and must be 60 characters or fewer.':'Display name is required and must be 60 characters or fewer.', 'Unsupported language.':'Unsupported language.'
  },
  ja: {
    pageTitle: 'スマート冷蔵庫', loginTitle: 'おかえりなさい', loginSubtitle: 'キッチンの食材を、すっきり管理。',
    registerTitle: 'アカウントを作成', registerSubtitle: '冷蔵庫の中身を、もっとわかりやすく。',
    recoverTitle: 'パスワードを再設定', recoverIntro:'登録したメールアドレスを入力してください。登録済みの場合、確認コードを送信します。', metricSummary:'在庫の概要', authEyebrow: 'スマート冷蔵庫', username: 'ユーザー名', password: 'パスワード',
    usernamePlaceholder: 'ユーザー名を入力', email: 'メールアドレス', emailPlaceholder: 'you@example.com',
    passwordPlaceholder: 'パスワードを入力', newPasswordPlaceholder: '8文字以上で入力', otpPlaceholder: '6桁の確認コード',
    passwordHelp: '8文字以上で入力してください。', loginButton: 'ログイン', forgotLink: 'パスワードをお忘れですか？', noAccount: 'はじめてご利用ですか？',
    registerLink: 'アカウントを作成', createAccount: 'アカウントを作成', haveAccount: 'すでにアカウントをお持ちですか？', backLogin: 'ログインに戻る',
    loginError: 'ユーザー名またはパスワードが正しくありません。', signupSuccess: '登録が完了しました。ログインしてください。', resetSuccess: 'パスワードを更新しました。ログインしてください。',
    otpSent: 'アカウントが登録されている場合、確認コードをメールで送信します。10分以内に入力してください。', sendOtp: '確認コードを送信',
    otpCode: '確認コード', newPassword: '新しいパスワード', resetButton: 'パスワードを更新',
    brandName: '冷蔵庫', brandTagline: 'キッチンに、少しのゆとりを。', greeting: '冷蔵庫の中身をひと目で',
    dashboardSubtitle: '食材の状態と、今日使いたい食材がすぐにわかります。', profile: 'プロフィール', logout: 'ログアウト',
    profileTitle: 'プロフィール設定', displayName: '表示名', preferredLanguage: '表示言語', saveProfile: '変更を保存',
    emailReadOnly: 'メールアドレス', foodCount: '件の食材があります', totalItems: '登録食材', expiringCount: '期限が近い食材',
    wasteCount: '廃棄した食材', search: '食材名・カテゴリーで検索', restock: '買い足し', outOfStock: '在庫なし',
    expiring: '期限間近', expired: '期限切れ', useWithin: 'あと', days: '日以内', daysLeft: '日残り',
    addFood: '食材を追加', foodName: '食材名', foodNamePlaceholder: '例：アボカド', quantity: '数量',
    expiryDate: '賞味期限', category: 'カテゴリー', vegetables: '野菜', meatFish: '肉・魚', condiments: '調味料',
    dairy: '乳製品', breadRice: 'パン・ご飯', fruit: '果物', other: 'その他', add: '食材を追加', inventory: '冷蔵庫の在庫',
    useItUp: '食材を使い切る', menuIdeas: '食材からメニューを提案', aiLabel: 'AIメニュー提案',
    suggestionNote: '冷蔵庫にある食材を使ったメニューのアイデアです。', trackWaste: '食品ロスを減らす', wasteHistory: '廃棄履歴',
    refresh: '更新', emptyInventory: '食材を追加して、冷蔵庫の管理を始めましょう。', expiry: '賞味期限', newExpiry: '新しい賞味期限',
    update: '日付を保存', markWaste: '廃棄を記録', remove: '削除', validFood: '食材名、数量、賞味期限を入力してください。',
    saveError: '変更を保存できませんでした。', networkError: '通信エラーが発生しました。', quantityError: '数量は0以上で入力してください。',
    removeConfirm: '廃棄記録を残さずに食材を削除しますか？', dateRequired: '日付を選択してください。',
    wasteQuantity: '廃棄する数量を入力してください。', wasteReason: '廃棄理由（期限切れ、傷み、その他）:',
    expiredReason: '期限切れ', noWaste: '廃棄記録はありません。', uses: '使用する食材', minutes: '分', noSuggestions: '食材を追加するとメニューを提案します。',
    profileSaved: 'プロフィールを保存しました。', logoutConfirm: 'ログアウトしますか？',
    'Vegetable fried rice': '野菜チャーハン', 'A quick way to use vegetables and cooked rice.': '野菜とご飯を使った手軽な料理です。',
    'Creamy tomato pasta': 'クリーミートマトパスタ', 'Pasta with a simple tomato and dairy sauce.': 'トマトと乳製品のシンプルなパスタです。',
    'Chicken and vegetable stir-fry': '鶏肉と野菜の炒め物', 'A flexible stir-fry using fresh produce.': '冷蔵庫の野菜で作れる炒め物です。',
    Omelette: 'オムレツ', 'A fast meal that works with leftover vegetables.': '残り野菜を活用できる手早い料理です。',
    'Fruit and yoghurt bowl': 'フルーツヨーグルト', 'A no-cook option for ripe fruit.': '熟した果物を使える火を使わない料理です。',
    'Tuna rice bowl': 'ツナ丼', 'A simple pantry meal with fresh toppings.': '常備食材と具材で作る簡単な丼です。',
    close:'閉じる',
    'Username must be 3 to 40 characters.':'ユーザー名は3文字以上40文字以内で入力してください。', 'Enter a valid email address.':'有効なメールアドレスを入力してください。',
    'Password must contain at least 8 characters.':'パスワードは8文字以上で入力してください。', 'That username is already in use.':'このユーザー名はすでに使用されています。',
    'That email address is already registered.':'このメールアドレスはすでに登録されています。', 'Invalid or expired reset code.':'確認コードが無効か、有効期限が切れています。',
    'Display name is required and must be 60 characters or fewer.':'表示名を入力してください（60文字以内）。', 'Unsupported language.':'選択できない言語です。'
  }
};

function applyLanguage(lang) {
  const chosen = messages[lang] ? lang : 'ja';
  const dict = messages[chosen];
  document.documentElement.lang = chosen;
  document.title = dict.pageTitle;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = dict[el.dataset.i18n];
    if (val) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const val = dict[el.dataset.i18nPlaceholder];
    if (val) el.setAttribute('placeholder', val);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const val = dict[el.dataset.i18nAria];
    if (val) el.setAttribute('aria-label', val);
  });
  document.querySelectorAll('[data-i18n-error]').forEach(el => {
    const val = dict[el.textContent.trim()];
    if (val) el.textContent = val;
  });
  const select = document.getElementById('languageSelect');
  if (select) select.value = chosen;
  localStorage.setItem('fridge-language', chosen);
  window.appMessages = messages;
  window.applyLanguage = applyLanguage;
}

document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(localStorage.getItem('fridge-language') || 'ja');
  const select = document.getElementById('languageSelect');
  if (select) select.addEventListener('change', () => {
    applyLanguage(select.value);
    if (!document.getElementById('profileForm')) {
      localStorage.setItem('fridge-language-pending', select.value);
    }
  });
});
