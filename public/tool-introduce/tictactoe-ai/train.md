<h3 class="title" style="font-size: 20px; margin-bottom: 12px; font-weight: 400;">训练模型</h3>

<p style="font-size: 14px; line-height: 22.4 px; margin: 12px 0;">基于前面选择的数据集进行模型训练，提供acc(准确度)、loss(损失值)两个训练指标，通过这两个指标可以直观的看到模型训练的好坏。</p>

<h3 class="title" style="font-size: 20px; margin: 36px auto 12px; font-weight: 400;">什么是ACC和LOSS</h3>

<p style="font-size: 14px; line-height: 22.4px; margin: 12px 0;">
ACC（准确率）<br />
想象一下你在玩射击游戏：<br />
ACC 就像你的命中率<br />
比如你开了 100 枪，命中了 85 枪，那么 ACC 就是 85%<br />
在 AI 训练中，就是模型预测正确的次数占总次数的百分比<br />
ACC 越高，说明模型 "枪法越好"，预测越准确<br />
LOSS（损失值）<br />
想象一下你在射箭：<br />
LOSS 就像箭偏离靶心的距离<br />
离靶心越远，LOSS 值越大<br />
离靶心越近，LOSS 值越小<br />
在 AI 训练中，就是模型预测结果与真实结果的差距<br />
LOSS 越小，说明模型预测得越准<br />
训练过程<br />
就像学习射箭一样：<br />
刚开始时，LOSS 很大（箭射得很偏），ACC 很低（命中率低）<br />
随着练习（训练），LOSS 逐渐变小（箭越来越准），ACC 逐渐提高（命中率上升）<br />
最终希望 LOSS 尽可能小，ACC 尽可能高<br />
<span style="color: #F87D57;">简单来说：ACC 告诉你模型做得有多好，LOSS 告诉你模型还有多大的进步空间。</span>
</p>