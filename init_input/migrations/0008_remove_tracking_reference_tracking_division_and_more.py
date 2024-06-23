# Generated by Django 5.0.6 on 2024-06-09 23:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configration', '0007_alter_division_program_alter_subject_testing'),
        ('init_input', '0007_alter_trainer_name_job'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tracking',
            name='reference',
        ),
        migrations.AddField(
            model_name='tracking',
            name='division',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='configration.division'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='tracking',
            name='projram',
            field=models.CharField(choices=[('morning', 'morning'), ('evening', 'evening')], default='morning', max_length=20, verbose_name='projram'),
        ),
        migrations.AlterField(
            model_name='tracking',
            name='semester',
            field=models.CharField(choices=[('second', 'Second semester'), ('first', 'First semester')], default='first', max_length=10, verbose_name='Semester'),
        ),
        migrations.AlterField(
            model_name='trainer',
            name='name_job',
            field=models.CharField(choices=[('1', 'مدرب ب'), ('2', 'مدرب أ'), ('3', 'مدرب اول ب'), ('4', 'مدرب اول أ'), ('5', 'كبير المدربين')], default='3', max_length=50, verbose_name='name'),
        ),
    ]
