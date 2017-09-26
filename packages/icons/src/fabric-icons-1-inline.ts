// tslint:disable:max-line-length

import { registerIcons } from '@uifabric/styling/lib/index';

export function initializeIcons(baseUrl: string = ''): void {
  registerIcons({
    style: {
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontStyle: 'normal',
      fontWeight: 'normal',
      speak: 'none'
    },
    fontFace: {
      fontFamily: `"FabricMDL2Icons-1"`,
      src: `url('data:application/octet-stream;base64,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') format('woff')`, 
    },
    icons: {
      'TVMonitor': '\uE7F4',
      'Speakers': '\uE7F5',
      'Nav2DMapView': '\uE800',
      'Car': '\uE804',
      'Bus': '\uE806',
      'EatDrink': '\uE807',
      'LocationCircle': '\uE80E',
      'Home': '\uE80F',
      'SwitcherStartEnd': '\uE810',
      'ParkingLocation': '\uE811',
      'IncidentTriangle': '\uE814',
      'Touch': '\uE815',
      'MapDirections': '\uE816',
      'History': '\uE81C',
      'Location': '\uE81D',
      'Work': '\uE821',
      'Recent': '\uE823',
      'Hotel': '\uE824',
      'LocationDot': '\uE827',
      'News': '\uE900',
      'Chat': '\uE901',
      'Group': '\uE902',
      'Previous': '\uE892',
      'Next': '\uE893',
      'Sync': '\uE895',
      'Help': '\uE897',
      'Emoji': '\uE899',
      'MailForward': '\uE89C',
      'ClosePane': '\uE89F',
      'OpenPane': '\uE8A0',
      'PreviewLink': '\uE8A1',
      'ZoomIn': '\uE8A3',
      'Bookmarks': '\uE8A4',
      'Document': '\uE8A5',
      'ProtectedDocument': '\uE8A6',
      'OpenInNewWindow': '\uE8A7',
      'MailFill': '\uE8A8',
      'ViewAll': '\uE8A9',
      'Switch': '\uE8AB',
      'Rename': '\uE8AC',
      'Import': '\uE8B5',
      'Picture': '\uE8B9',
      'ShowResults': '\uE8BC',
      'Message': '\uE8BD',
      'CalendarDay': '\uE8BF',
      'CalendarWeek': '\uE8C0',
      'MailReplyAll': '\uE8C2',
      'Read': '\uE8C3',
      'Cut': '\uE8C6',
      'PaymentCard': '\uE8C7',
      'Copy': '\uE8C8',
      'Important': '\uE8C9',
      'MailReply': '\uE8CA',
      'GotoToday': '\uE8D1',
      'Font': '\uE8D2',
      'FontColor': '\uE8D3',
      'FolderFill': '\uE8D5',
      'Permissions': '\uE8D7',
      'DisableUpdates': '\uE8D8',
      'Unfavorite': '\uE8D9',
      'Italic': '\uE8DB',
      'Underline': '\uE8DC',
      'Bold': '\uE8DD',
      'MoveToFolder': '\uE8DE',
      'Dislike': '\uE8E0',
      'Like': '\uE8E1',
      'AlignCenter': '\uE8E3',
      'OpenFile': '\uE8E5',
      'FontDecrease': '\uE8E7',
      'FontIncrease': '\uE8E8',
      'FontSize': '\uE8E9',
      'CellPhone': '\uE8EA',
      'Library': '\uE8F1',
      'PostUpdate': '\uE8F3',
      'NewFolder': '\uE8F4',
      'CalendarReply': '\uE8F5',
      'UnsyncFolder': '\uE8F6',
      'SyncFolder': '\uE8F7',
      'BlockContact': '\uE8F8',
      'BulletedList': '\uE8FD',
      'Preview': '\uE8FF',
      'World': '\uE909',
      'Comment': '\uE90A',
      'DockLeft': '\uE90C',
      'DockRight': '\uE90D',
      'Repair': '\uE90F',
      'Accounts': '\uE910',
      'RadioBullet': '\uE915',
      'Stopwatch': '\uE916',
      'Clock': '\uE917',
      'WorldClock': '\uE918',
      'AlarmClock': '\uE919',
      'Hospital': '\uE91D',
      'Timer': '\uE91E',
      'FullCircleMask': '\uE91F',
      'LocationFill': '\uE920',
      'ChromeMinimize': '\uE921',
      'Annotation': '\uE924',
      'ChromeClose': '\uE8BB',
      'Accept': '\uE8FB'
    }
  });
}