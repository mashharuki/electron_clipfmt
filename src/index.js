/**
 * Appコンポーネントファイル
 */

// 必要なモジュールを読み込む
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
const {clipboard} = require('electron')

// コンポーネントを定義
export default class App extends Component {
    /**
     * コンストラクター関数
     * @param {*} props 
     */
    constructor (props) {
        super(props)
        // ステートを宣言する。
        this.state = {
            text: '',
            isActive: false,
            zen2han: true
        }
        // setInterval関数を呼び出す。
        setInterval(e => this.tick(), 1000)
    }

    /*
     * 全角英数を半角英数に変換する関数
     */
    convToHalfWidth (str) {
        const s2 = str.replace(/[！-～]/g, e => {
            return String.fromCharCode(e.charCodeAt(0) - 0xFEE0)
        })
        return s2
    }

    tick () {
        if (!this.state.isActive) return
        const clip = clipboard.readText()
        let clip2 = clip

        if (this.state.zen2han) {
            clip2 = this.convToHalfWidth(clip)
        }

        if (clip !== clip2) {
            clipboard.writeText(clip2)
        }
        // ステート変数を更新する。
        this.setState({text: clip})
    }

    /**
     * 情報が変わった時に呼び出される関数
     * @param {*} e 
     */
    changeState (e) {
        const name = e.target.name
        this.setState({[name]: !this.state[name]})
    }

    // レンダリングする。
    render () {
        // スタイルを定義する。
        const taStyle = {
            width: '100%',
            height: '300px',
            backgroundColor: '#F4F4F4'
        }
        // レンダリングする内容
        return (
            <div className='window'>
                <div className='window-content'>
                    <div className='pane-group'>
                        <div className='pane-sm sidebar'>
                            <div>
                                <ul className='list-group'>
                                    <li className='list-group-item'>
                                        <label>
                                            <input type='checkbox'checked={this.state.isActive} name='isActive' onChange={e => this.changeState(e)} />
                                            監視を有効に
                                        </label>
                                    </li>
                                    <li className='list-group-item'>
                                        <label>
                                            <input type='checkbox' checked={this.state.zen2han} name='zen2han' onChange={e => this.changeState(e)} />
                                            全角英数を半角に
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='pane'>
                            <div className='padded-more'>
                                クリップボード:<br />
                                <textarea style={taStyle} value={this.state.text} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// DOMを書き換え
ReactDOM.render(
  <App />,
  // Idがrootの要素を取得する。
  document.getElementById('root')
)
