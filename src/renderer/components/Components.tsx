import * as React from 'react'

export class HGLContainer extends React.Component<any, any> {
    render() {
        return (
            <div className="hgl-container">
                {this.props.children}
            </div>
        );
    }
}

export class HGLHeader extends React.Component<any, any> {
    render() {
        return (
            <div className="hgl-header">
                {this.props.children}
            </div>
        );
    }
}

export class HGLFooter extends React.Component<any, any> {
    render() {
        return (
            <div className="hgl-footer">
                {this.props.children}
            </div>
        );
    }
}

export class HGLCenter extends React.Component<any, any> {
    render() {
        return (
            <div className="hgl-center">
                {this.props.children}
            </div>
        );
    }
}

