import { WalletMessages } from '../types'

const wallet: WalletMessages = {
  'wallet.nav.stakes': 'Stakes',
  'wallet.nav.bonds': 'Bonds',
  'wallet.column.name': 'Имя',
  'wallet.column.ticker': 'Ticker',
  'wallet.column.balance': 'Баланс',
  'wallet.column.value': 'Количество',
  'wallet.action.send': 'Отправить',
  'wallet.action.receive': 'Получить',
  'wallet.action.freeze': 'Freeze - RU',
  'wallet.action.unfreeze': 'Unfreeze - RU',
  'wallet.action.remove': 'Удалить кошелек',
  'wallet.action.unlock': 'Разблокировать',
  'wallet.unlock.title': 'Разблокировать кошелек',
  'wallet.unlock.phrase': 'Введите ваш пароль',
  'wallet.unlock.error': 'Не получилось разблокировать кошелек. Пожалуйста, проверьте пароль и попробуйте еще раз',
  'wallet.imports.phrase': 'Фраза',
  'wallet.imports.wallet': 'Импортировать существующий кошелек',
  'wallet.imports.enterphrase': 'Введите фразу',
  'wallet.txs.last90days': 'Транзакции за последние 90 дней',
  'wallet.empty.action.import': 'Импортировать',
  'wallet.empty.action.create': 'Создать',
  'wallet.empty.phrase.import': 'Импортировать существующий кошелек с балансом',
  'wallet.empty.phrase.create': 'Создать новый кошелек с балансом',
  'wallet.create.copy.phrase': 'Скопируйте фразу ниже',
  'wallet.create.title': 'Создать новый кошелек',
  'wallet.create.enter.phrase': 'Введите правильную фразу',
  'wallet.create.words.click': ' Выберите слова в правильном порядке',
  'wallet.create.creating': 'Создание кошелька',
  'wallet.create.password.repeat': 'Повторите парроль',
  'wallet.create.password.mismatch': 'Пароли не совпадают',
  'wallet.create.error': 'Ошибка при сохранении фрразы',
  'wallet.receive.address.error': 'Нет доступных адресов для получения',
  'wallet.receive.address.errorQR': 'Ошибка при создании QR-кода: {error}',
  'wallet.errors.balancesFailed': 'Нет загруженных балансов',
  'wallet.errors.address.empty': "Address can't be empty - RU",
  'wallet.errors.address.invalid': 'Address is invalid - RU',
  'wallet.errors.amount.shouldBeNumber': 'Количество должно быть числом',
  'wallet.errors.amount.shouldBeGreaterThan': 'Количество должно быть больше, чем {amount}',
  'wallet.errors.amount.shouldBeLessThanBalance': 'Количество должно быть меньше вашего баланса'
}

export default wallet
