import React from 'react'
import PropTypes from 'prop-types'
//import Iconfont from '../../components/Iconfont';


class RadarChart extends React.Component {

    constructor(){
        super();
        this.state = {
            data: [],
            maxDemension: 10
        }
    }



    componentWillMount(){
        const {demension, data, maxDemension} = this.props;
        let rt = data;
        // 判断是否数据合法
        if (data.length !== demension) {
            console.log('你应该输入%d维数组', demension);
            rt = this.dataPreCheck(rt);
        }
        this.setState({
            data: rt,
            maxDemension: maxDemension
        })
    }

    componentDidMount(){
        const {width, height, demension, radius} = this.props;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height || width;
        // 角度
        this.angle = Math.PI*2 / demension;
        // 中点
        this.center = {
            x: this.canvas.width/2,
            y: this.canvas.height/2
        }

        // 这里需要优化一下，保证点不超过画布
        // 暂时就这样吧
        const min = Math.min(this.center.x, this.center.y);

        this.radius = Math.min(min, radius) - 10;
        // 判断是否支持canvas
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
            this.holder.appendChild(this.canvas);
            // 绘制
            this.init(this.ctx);
        } else {
            // 不支持canvas
        }
    }

    componentWillReceiveProps(nextProps){
        if (this.state.data === nextProps.data) {
            return;
        }
        const tData = this.dataPreCheck(nextProps.data);
        this.setState({
            data: tData
        },()=>{
            this.repaint(this.ctx);
        })
    }

    // 数据监测
    dataPreCheck = (data) => {
        let rt;
        const {demension, extraDemensionName, extraDemensionValue, spreadTime} = this.props;
        const {maxDemension} = this.state
        // 检查维度
        if (data.length !== demension) {
            const extraNum = demension - data.length;
            console.log('你应该输入%d维数组', demension);
            let d = Array.from({length: extraNum}, () => {
                return [extraDemensionName, extraDemensionValue];
            })
            rt = [...data, ...d];
        }
        // 检查维度最大值

        const values = rt.map(d => {
            return d[1]
        });
        const mValue = Math.max(...values);
        if (mValue > maxDemension) {
            let temp = maxDemension;
            while(temp<mValue) {
                temp = Math.ceil(temp*spreadTime);
            }
            this.setState({
                maxValue: temp
            })
        }
        return rt;
    }
 
    repaint = (ctx) => {
        this.drawText(ctx);  //绘制文本
        this.drawRegion(ctx); //绘制覆盖区域 
    }

    init = (mCtx) => {
        this.drawPolygon(mCtx);  //绘制多边形
        this.drawLines(mCtx);  //绘制直线
        this.drawText(mCtx);  //绘制文本
        this.drawRegion(mCtx); //绘制覆盖区域
    }

    drawPolygon = (ctx) => {
        const {polygonColor, demension, repeat} = this.props;
        const tRepeat = repeat || demension;
        ctx.save();   // save the default state
        ctx.strokeStyle = polygonColor;
        let r = this.radius / tRepeat;
        for(let i = 0; i < tRepeat; i++) {
            ctx.beginPath();   //开始路径
            let currR = r * (i + 1);
            for(let j = 0; j < demension; j++) {
                let x = this.center.x + currR*Math.cos(this.angle*j);
                let y = this.center.y + currR*Math.sin(this.angle*j);
                ctx.lineTo(x, y);  
            }
            ctx.closePath();  //闭合路径
            ctx.stroke()  // restore to the default state
        }
        ctx.restore();
    }

    drawLines = (ctx) => {
        const {polygonColor, demension} = this.props;
        const tRepeat = demension;

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = polygonColor;
        for( let i = 0; i< tRepeat; i++){
            let x = this.center.x + this.radius * Math.cos(this.angle*i);
            let y = this.center.y + this.radius * Math.sin(this.angle*i);
            ctx.moveTo(this.center.x, this.center.y);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
    }

    drawText = (ctx) => {
        const {textColor, infoColor, demension, fontSize, maxDemensionInfo} = this.props;
        const {data, maxDemension} = this.state;
        const {angle, radius, center} = this;
        let size;
        ctx.save();
        if (typeof fontSize === 'string') {
            size = +fontSize.split('px')[0];
        } else {
            size = fontSize
        }
        ctx.font = size + 'px Microsoft Yahei';
        ctx.fillStyle = textColor;
        // 每个属性字体
        for(let i = 0; i< demension; i++){
            let x = center.x + radius*Math.cos(angle*i);
            let y = center.y + radius*Math.sin(angle*i);
            //通过不同的位置，调整文本的显示位置
            if( angle * i >= 0 && this.angle * i <= Math.PI / 2 ){
                ctx.fillText(data[i][0], x, y + fontSize);
            }else if(angle * i > Math.PI / 2 && angle * i <= Math.PI){
                ctx.fillText(data[i][0], x - ctx.measureText(data[i][0]).width, y + fontSize);
            }else if(angle * i > Math.PI && angle * i <= Math.PI * 3 / 2){
                ctx.fillText(data[i][0], x - ctx.measureText(data[i][0]).width, y);
            }else{
                ctx.fillText(data[i][0], x, y);
            }
        }

        // 维度最大值字体
        if (maxDemensionInfo) {
            ctx.textAlign = 'center';
            ctx.fillStyle = infoColor;
            ctx.fillText('Max is: '+maxDemension, center.x, (center.y-radius)/2);
            ctx.textAlign = 'start';
        }
        ctx.restore();
    }

    drawRegion = (ctx) => {
        const { demension, maxDemension, regionColor} = this.props;
        const {angle, radius, center} = this;
        const {data} = this.state;
        ctx.save();
        ctx.beginPath();
        for(let i = 0; i< demension; i++){
            let x = center.x + radius*Math.cos(angle*i)*(data[i][1]/maxDemension);
            let y = center.y + radius*Math.sin(angle*i)*(data[i][1]/maxDemension);
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = regionColor;
        ctx.fill();
        ctx.restore();
    }


    render() {
        return (
            <div className={this.props.className} ref={node=>this.holder = node}>

            </div>
        )
    }
}

RadarChart.defaultProps = {
    className: 'Attribute_Radar_Chart',
    width: 180,
    data: [],
    maxDemension: 12,
    textColor: 'black',
    bg: '#000000',
    border: 'none',
    demension: 6,
    radius: 60,
    regionColor: '#de4841',
    polygonColor: '#000000',
    infoColor: 'red',
    fontSize: 10,
    extraDemensionName: '',
    extraDemensionValue: 4,
    maxDemensionInfo: false,
    spreadTime: 2
}


RadarChart.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object,
        PropTypes.oneOf([null, undefined])
    ]),
    fontSize: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    data: PropTypes.arrayOf(PropTypes.array),
    border: PropTypes.string,
    bg: PropTypes.string,
    polygonColor: PropTypes.string,
    regionColor: PropTypes.string,
    extraDemensionName: PropTypes.string,   // 填充维度名
    extraDemensionValue: PropTypes.number,  // 填充维度大小
    textColor: PropTypes.string,
    radius: PropTypes.number, // 从画布中点画到的最远距离
    repeat: PropTypes.number, // 重复画多少个正多边型，默认demension
    demension: PropTypes.number, // 维度
    maxDemension: PropTypes.number, //某维最大值，某一项超过该值之后自动增大。5倍适应该值
    maxDemensionInfo: PropTypes.bool, // 是否显示最大维度值
    infoColor: PropTypes.string,
    spreadTime: PropTypes.number    // 维度增长倍数
}

export default RadarChart
