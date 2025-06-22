'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/lib/exam-store';
import { Trash2, Plus } from 'lucide-react';

interface QuestionFormProps {
  question?: Question;
  onSave: (question: Omit<Question, 'id'>) => void;
  onCancel: () => void;
}

export function QuestionForm({ question, onSave, onCancel }: QuestionFormProps) {
  const [type, setType] = useState<Question['type']>(question?.type || 'multiple-choice');
  const [questionText, setQuestionText] = useState(question?.question || '');
  const [options, setOptions] = useState<string[]>(question?.options || ['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<string | number>(question?.correctAnswer || '');
  const [points, setPoints] = useState(question?.points || 10);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    // Reset correct answer if it was the removed option
    if (typeof correctAnswer === 'number' && correctAnswer >= index) {
      setCorrectAnswer(Math.max(0, correctAnswer - 1));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const questionData: Omit<Question, 'id'> = {
      type,
      question: questionText,
      points,
      ...(type === 'multiple-choice' && {
        options: options.filter(opt => opt.trim() !== ''),
        correctAnswer: typeof correctAnswer === 'number' ? correctAnswer : 0
      }),
      ...(type === 'true-false' && {
        correctAnswer: correctAnswer === 'true' ? 'true' : 'false'
      })
    };

    onSave(questionData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {question ? 'Edit Question' : 'New Question'}
          <Badge variant="secondary" className="ml-2">
            {type.replace('-', ' ')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question-type">Question Type</Label>
            <Select value={type} onValueChange={setType as (value: string) => void}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                <SelectItem value="true-false">True/False</SelectItem>
                <SelectItem value="open-ended">Open Ended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-text">Question</Label>
            <Textarea
              id="question-text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question here..."
              rows={3}
              required
            />
          </div>

          {type === 'multiple-choice' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Answer Options</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>
              
              <RadioGroup
                value={correctAnswer.toString()}
                onValueChange={(value) => setCorrectAnswer(parseInt(value))}
              >
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {type === 'true-false' && (
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <RadioGroup
                value={correctAnswer.toString()}
                onValueChange={setCorrectAnswer}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="true" />
                  <Label htmlFor="true">True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="false" />
                  <Label htmlFor="false">False</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
              min="1"
              required
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit">Save Question</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}