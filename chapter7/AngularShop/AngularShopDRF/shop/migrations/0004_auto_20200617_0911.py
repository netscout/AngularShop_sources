# Generated by Django 3.0.7 on 2020-06-17 00:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0003_productimage'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='createdDate',
            new_name='created_Date',
        ),
        migrations.RenameField(
            model_name='product',
            old_name='modifiedDate',
            new_name='modified_Date',
        ),
        migrations.AlterField(
            model_name='product',
            name='created_Date',
            field=models.DateTimeField(auto_now_add=True, db_column='createdDate'),
        ),
        migrations.AlterField(
            model_name='product',
            name='modified_Date',
            field=models.DateTimeField(auto_now_add=True, db_column='modifiedDate', null=True),
        ),
    ]
